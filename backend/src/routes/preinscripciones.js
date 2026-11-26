import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { db } from '../db.js';
import { talleres } from '../data/talleres.js';
import { enviarComprobante } from '../services/correo.js';

const router = Router();
const indicaciones = 'Conserva tu folio para completar la inscripción en la sede. El lugar está sujeto a disponibilidad. Si el taller tiene costo, el pago se realiza ahí.';

router.post('/', async (request, response) => {
  const { tallerId, sesionId, nombre, correo } = request.body ?? {};
  const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
  const correoLimpio = typeof correo === 'string' ? correo.trim().toLowerCase() : '';

  if (!nombreLimpio || nombreLimpio.length > 100 || correoLimpio.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
    return response.status(400).json({ error: 'Escribe un nombre y un correo válidos.' });
  }

  const taller = talleres.find(item => item.id === tallerId);
  const sesion = taller?.sesiones.find(item => item.id === sesionId);
  if (!sesion) return response.status(404).json({ error: 'No encontramos la sesión seleccionada.' });
  if (sesion.cupo <= 0) return response.status(409).json({ error: 'La sesión no tiene cupo.' });

  const folio = `AV-${randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()}`;
  try {
    const registro = await db().query(
      `INSERT INTO preinscripciones (folio, taller_id, sesion_id, nombre, correo)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (taller_id, sesion_id, correo) DO NOTHING
       RETURNING folio, estado`,
      [folio, taller.id, sesion.id, nombreLimpio, correoLimpio],
    );
    if (!registro.rowCount) {
      return response.status(409).json({ error: 'Ese correo ya tiene una preinscripción para esta sesión.' });
    }
  } catch (error) {
    if (error.status === 503) return response.status(503).json({ error: error.message });
    console.error('Error guardando preinscripción:', error.code ?? 'sin código');
    return response.status(503).json({ error: 'Por ahora no se pudo guardar la preinscripción. Intenta más tarde.' });
  }

  const envioCorreo = await enviarComprobante({ correo: correoLimpio, folio, taller, sesion, indicaciones });
  response.set('Cache-Control', 'no-store');
  return response.status(201).json({
    folio,
    estado: 'recibida',
    taller: taller.nombre,
    sede: taller.sede ?? taller.municipio,
    fecha: sesion.fecha,
    horario: sesion.horario,
    modalidad: sesion.modalidad,
    indicaciones,
    envioCorreo,
  });
});

export default router;
