import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../services/useApi';

export default function Preinscripcion({ id, sesionId }) {
  const { datos: taller, cargando, error } = useApi(`/api/talleres/${encodeURIComponent(id)}`);
  const sesion = taller?.sesiones.find(item => item.id === sesionId);
  const disponible = sesion && sesion.cupo > 0;
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  async function enviar(event) {
    event.preventDefault();
    if (enviando || !disponible) return;

    const datos = new FormData(event.currentTarget);
    setEnviando(true);
    setErrorEnvio('');

    try {
      const respuesta = await fetch('/api/preinscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tallerId: id,
          sesionId,
          nombre: datos.get('nombre'),
          correo: datos.get('correo'),
        }),
      });
      const comprobante = await respuesta.json();
      if (!respuesta.ok) throw new Error(comprobante.error ?? 'No se pudo guardar la solicitud.');

      navigate('/comprobante', { state: comprobante, replace: true });
    } catch (error) {
      setErrorEnvio(error.message);
      setEnviando(false);
    }
  }

  return (
    <section className="preinscripcion">
      <Link to={`/talleres/${encodeURIComponent(id)}`}>Volver al taller</Link>
      <h1>Preinscripción</h1>
      {cargando && <p role="status">Cargando sesión…</p>}
      {error && <p role="alert">{error}</p>}
      {taller && !disponible && <p role="alert">La sesión no está disponible.</p>}
      {disponible && (
        <>
          <h2>{taller.nombre}</h2>
          <p>{sesion.modalidad && `${sesion.modalidad} · `}{sesion.fecha} · {sesion.horario}</p>
          <p>Esta es una demostración. Usa un nombre ficticio y un correo de prueba.</p>
          <form onSubmit={enviar}>
            <label>Nombre <input name="nombre" required maxLength={100} autoComplete="name" /></label>
            <label>Correo electrónico <input name="correo" type="email" required maxLength={254} autoComplete="email" /></label>
            {errorEnvio && <p role="alert">{errorEnvio}</p>}
            <button className="boton" disabled={enviando}>{enviando ? 'Guardando…' : 'Enviar preinscripción'}</button>
          </form>
        </>
      )}
    </section>
  );
}
