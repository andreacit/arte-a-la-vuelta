import React, { useState } from 'react';
import { Link } from 'react-router-dom';

async function solicitar(ruta, clave, { method = 'GET' } = {}) {
  const respuesta = await fetch(`/api/organizador${ruta}`, {
    method,
    headers: { Authorization: `Bearer ${clave}` },
  });

  if (respuesta.status === 204) return null;
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error ?? 'No se pudo completar la operación.');
  return datos;
}

function FichaPreinscripcion({ ficha, ocupado, confirmar }) {
  const confirmada = ficha.estado === 'confirmada';

  return (
    <section aria-labelledby="titulo-ficha">
      <h2 id="titulo-ficha">Datos de la preinscripción</h2>
      <dl className="ficha">
        <dt>Folio</dt><dd>{ficha.folio}</dd>
        <dt>Nombre</dt><dd>{ficha.nombre}</dd>
        <dt>Taller</dt><dd>{ficha.taller}</dd>
        <dt>Sesión</dt><dd>{ficha.modalidad && `${ficha.modalidad} · `}{ficha.fecha} · {ficha.horario}</dd>
        <dt>Sede</dt><dd>{ficha.sede}</dd>
        <dt>Estado</dt><dd role="status">{confirmada ? 'Inscripción confirmada' : 'Preinscripción recibida'}</dd>
        <dt>Cupo</dt><dd>{ficha.cupo || 'Sin cupo'}</dd>
      </dl>
      {!confirmada && ficha.cupo > 0 && (
        <>
          <p>Confirma después de validar el trámite en la sede.</p>
          <button className="boton" type="button" disabled={ocupado} onClick={confirmar}>
            Confirmar inscripción
          </button>
        </>
      )}
    </section>
  );
}

export default function PanelOrganizador() {
  const [clave, setClave] = useState('');
  const [ficha, setFicha] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  async function ejecutar(accion) {
    if (ocupado) return;
    setOcupado(true);
    setError('');
    try {
      await accion();
    } catch (problema) {
      setError(problema.message);
    } finally {
      setOcupado(false);
    }
  }

  function entrar(event) {
    event.preventDefault();
    const acceso = new FormData(event.currentTarget).get('clave').trim();
    ejecutar(async () => {
      await solicitar('/acceso', acceso);
      setClave(acceso);
    });
  }

  function buscar(event) {
    event.preventDefault();
    const folio = new FormData(event.currentTarget).get('folio').trim().toUpperCase();
    ejecutar(async () => {
      setFicha(null);
      setFicha(await solicitar(`/preinscripciones/${encodeURIComponent(folio)}`, clave));
    });
  }

  function confirmar() {
    ejecutar(async () => {
      const ruta = `/preinscripciones/${ficha.folio}`;
      try {
        setFicha(await solicitar(`${ruta}/confirmar`, clave, { method: 'POST' }));
      } catch (problema) {
        setFicha(null);
        throw problema;
      }
    });
  }

  return (
    <section className="preinscripcion">
      <Link to="/">Volver al inicio</Link>
      <h1>Panel del organizador</h1>
      {clave ? (
        <>
          <form onSubmit={buscar}>
            <label>Folio <input name="folio" placeholder="AV-…" maxLength={19} required /></label>
            <button className="boton" disabled={ocupado}>Buscar</button>
          </form>
          {ficha && <FichaPreinscripcion ficha={ficha} ocupado={ocupado} confirmar={confirmar} />}
          <button className="salir-panel" type="button" disabled={ocupado} onClick={() => {
            setClave('');
            setFicha(null);
            setError('');
          }}>Cerrar acceso</button>
        </>
      ) : (
        <form onSubmit={entrar}>
          <label>Clave del organizador <input name="clave" type="password" autoComplete="current-password" required /></label>
          <button className="boton" disabled={ocupado}>Entrar</button>
        </form>
      )}
      {ocupado && <p role="status">Procesando…</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
