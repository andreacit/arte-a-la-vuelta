import React from 'react';
import { Link } from 'react-router-dom';
import useApi from '../services/useApi';

export default function DetalleTaller({ id }) {
  const { datos: taller, cargando, error } = useApi(`/api/talleres/${encodeURIComponent(id)}`);

  return (
    <>
      <Link to="/talleres">Volver a talleres</Link>
      {cargando && <p role="status">Cargando taller…</p>}
      {error && <p role="alert">{error}</p>}
      {taller && (
        <article>
          <h1>{taller.nombre}</h1>
          {taller.imagen && (
            <img className="foto-taller foto-taller-detalle" src={taller.imagen} alt={taller.imagenAlt ?? ''} />
          )}
          <p>{taller.descripcion}</p>
          <dl className="ficha">
            <dt>Municipio</dt><dd>{taller.municipio}</dd>
            {taller.sede && <><dt>Sede</dt><dd>{taller.sede}</dd></>}
            <dt>Organizador</dt><dd>{taller.organizador ?? 'No indicado en el cartel'} · {taller.tipo}</dd>
            {taller.docente && <><dt>Imparte</dt><dd>{taller.docente}</dd></>}
            {taller.publico && <><dt>Dirigido a</dt><dd>{taller.publico}</dd></>}
            {taller.materiales && <><dt>Materiales</dt><dd>{taller.materiales}</dd></>}
            <dt>Costo publicado</dt><dd>{taller.costo ?? 'No indicado en el cartel'}</dd>
            <dt>Horario del cartel</dt><dd>{taller.horarioPublicado}</dd>
          </dl>
          <h2>Sesiones de demostración</h2>
          <p>Estas fechas y cupos son de ejemplo. Consulta al organizador para conocer la disponibilidad real.</p>
          <ul className="lista-sesiones">
            {taller.sesiones.map(sesion => (
              <li key={sesion.id}>
                <div>
                  {sesion.modalidad && <strong>{sesion.modalidad}<br /></strong>}
                  {sesion.fecha} · {sesion.horario}<br />
                  {sesion.cupo > 0 ? `${sesion.cupo} lugares de demostración` : 'Sin cupo'}
                </div>
                {sesion.cupo > 0 && (
                  <Link className="boton" to={`/talleres/${taller.id}/preinscripcion/${sesion.id}`}>
                    Preinscribirme
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </article>
      )}
    </>
  );
}
