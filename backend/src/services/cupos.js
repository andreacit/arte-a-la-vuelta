import { db } from '../db.js';

export async function consultarCupos(talleres) {
  if (!process.env.DATABASE_URL) return talleres;

  const { rows } = await db().query(
    `SELECT taller_id, sesion_id, count(*)::integer AS ocupados
     FROM preinscripciones WHERE estado = 'confirmada'
     GROUP BY taller_id, sesion_id`,
  );
  const ocupados = new Map(rows.map(fila => [`${fila.taller_id}/${fila.sesion_id}`, fila.ocupados]));

  return talleres.map(taller => ({
    ...taller,
    sesiones: taller.sesiones.map(sesion => ({
      ...sesion,
      cupo: Math.max(0, sesion.cupo - (ocupados.get(`${taller.id}/${sesion.id}`) ?? 0)),
    })),
  }));
}

export async function lugaresDisponibles(cliente, taller, sesion) {
  const { rows: [fila] } = await cliente.query(
    `SELECT count(*)::integer AS ocupados FROM preinscripciones
     WHERE taller_id = $1 AND sesion_id = $2 AND estado = 'confirmada'`,
    [taller.id, sesion.id],
  );
  return Math.max(0, sesion.cupo - fila.ocupados);
}
