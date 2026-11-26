import React from 'react';
import { Link } from 'react-router-dom';
import mosaico from '../assets/mosaico.jpeg';

export default function Inicio() {
  return (
    <section className="portada">
      <div>
        <h1>Arte a la Vuelta</h1>
        <p>Encuentra talleres de arte, artesanías y oficios en Guadalajara, Zapopan y San Pedro Tlaquepaque.</p>
        <Link className="boton" to="/talleres">Explorar talleres</Link>
      </div>
      <img className="franja-pictorica" src={mosaico} alt="" />
    </section>
  );
}
