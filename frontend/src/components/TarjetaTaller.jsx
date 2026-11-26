import React from 'react';
import { Link } from 'react-router-dom';

export default function TarjetaTaller({ taller }) {
  return (
    <article className="tarjeta">
      {taller.imagen && (
        <img className="foto-taller" src={taller.imagen} alt={taller.imagenAlt ?? ''} loading="lazy" />
      )}
      <p className="etiqueta">{taller.disciplina} · {taller.tipo}</p>
      <h2><Link to={`/talleres/${taller.id}`}>{taller.nombre}</Link></h2>
      <p>{taller.descripcion}</p>
      <p>{taller.municipio}</p>
    </article>
  );
}
