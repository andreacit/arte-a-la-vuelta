import React from 'react';
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom';
import emblema from './assets/emblema.jpg';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleTaller from './pages/DetalleTaller';

function DetalleRoute() {
  const { id } = useParams();
  return <DetalleTaller key={id} id={id} />;
}

export default function App() {
  return (
    <>
      <header className="cabecera">
        <Link className="marca" to="/">
          <img src={emblema} alt="" width="36" height="36" />
          Arte a la Vuelta
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/talleres">Talleres</NavLink>
        </nav>
      </header>
      <main className="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/talleres" element={<Catalogo />} />
          <Route path="/talleres/:id" element={<DetalleRoute />} />
          <Route path="*" element={<><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></>} />
        </Routes>
      </main>
      <footer>
        <strong>Andrea Citlalli Andrade Rico</strong>
        <p>Desarrollo de aplicaciones web en la nube y móviles · Mtro. Zeus Cobián · 2026B</p>
      </footer>
    </>
  );
}
