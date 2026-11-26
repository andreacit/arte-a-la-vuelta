import { createHash, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { db } from '../db.js';
import { talleres } from '../data/talleres.js';
import { lugaresDisponibles } from '../services/cupos.js';

const router = Router();
const digest = valor => createHash('sha256').update(valor).digest();

router.use((request, response, next) => {
  response.set('Cache-Control', 'no-store');
  const clave = process.env.ORGANIZADOR_CLAVE;
  if (!clave) return response.status(503).json({ error: 'El acceso del organizador aún no está configurado.' });

  const token = request.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token || !timingSafeEqual(digest(token), digest(clave))) {
    return response.status(401).json({ error: 'La clave de acceso es incorrecta.' });
  }
  next();
});

router.get('/acceso', (_request, response) => response.sendStatus(204));

function problema(status, message) {
  return Object.assign(new Error(message), { status });
}

function datosSesion(registro) {
  const taller = talleres.find(item => item.id === registro.taller_id);
  const sesion = taller?.sesiones.find(item => item.id === registro.sesion_id);
  if (!sesion) throw problema(409, 'La sesión de este folio ya no está en el catálogo.');
  return { taller, sesion };
}

async function consultarFolio(cliente, folio, bloquear = false) {
  if (!/^AV-[A-F0-9]{16}$/.test(folio)) throw problema(400, 'Escribe un folio válido.');
  const { rows: [registro] } = await cliente.query(
    `SELECT folio, taller_id, sesion_id, nombre, estado FROM preinscripciones
     WHERE folio = $1${bloquear ? ' FOR UPDATE' : ''}`,
    [folio],
  );
  if (!registro) throw problema(404, 'No encontramos una preinscripción con ese folio.');
  return registro;
}

function ficha(registro, taller, sesion, cupo) {
  return {
    folio: registro.folio,
    nombre: registro.nombre,
    estado: registro.estado,
    taller: taller.nombre,
    sede: taller.sede ?? taller.municipio,
    fecha: sesion.fecha,
    horario: sesion.horario,
    modalidad: sesion.modalidad,
    cupo,
  };
}

router.get('/preinscripciones/:folio', async (request, response) => {
  const cliente = db();
  const registro = await consultarFolio(cliente, request.params.folio.toUpperCase());
  const { taller, sesion } = datosSesion(registro);
  const cupo = await lugaresDisponibles(cliente, taller, sesion);
  return response.json(ficha(registro, taller, sesion, cupo));
});

router.post('/preinscripciones/:folio/confirmar', async (request, response) => {
  const cliente = await db().connect();

  try {
    await cliente.query('BEGIN');
    const registro = await consultarFolio(cliente, request.params.folio.toUpperCase(), true);
    const { taller, sesion } = datosSesion(registro);

    // Serializa las confirmaciones de una sesión, incluso si son folios distintos.
    await cliente.query('SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))', [taller.id, sesion.id]);
    let cupo = await lugaresDisponibles(cliente, taller, sesion);

    if (registro.estado === 'recibida') {
      if (cupo === 0) throw problema(409, 'La sesión ya no tiene cupo.');
      await cliente.query(
        `UPDATE preinscripciones SET estado = 'confirmada' WHERE folio = $1`,
        [registro.folio],
      );
      registro.estado = 'confirmada';
      cupo -= 1;
    }

    await cliente.query('COMMIT');
    return response.json(ficha(registro, taller, sesion, cupo));
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
});

export default router;
