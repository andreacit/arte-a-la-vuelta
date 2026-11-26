import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const mensajesCorreo = {
  enviado: 'Enviamos el comprobante al correo que registraste.',
  no_enviado: 'El envío por correo aún no está habilitado para esta solicitud.',
  error: 'La solicitud se guardó, pero el correo no pudo enviarse. Guarda el folio de esta pantalla.',
};

export default function Comprobante() {
  const { state: comprobante } = useLocation();

  if (!comprobante?.folio) {
    return <><h1>Comprobante</h1><p>Abre una sesión del catálogo para iniciar una preinscripción.</p><Link to="/talleres">Ver talleres</Link></>;
  }

  return (
    <section className="preinscripcion">
      <h1>Preinscripción recibida</h1>
      <dl className="ficha">
        <dt>Folio</dt><dd><strong>{comprobante.folio}</strong></dd>
        <dt>Taller</dt><dd>{comprobante.taller}</dd>
        <dt>Sesión</dt><dd>{comprobante.modalidad && `${comprobante.modalidad} · `}{comprobante.fecha} · {comprobante.horario}</dd>
        <dt>Sede</dt><dd>{comprobante.sede}</dd>
      </dl>
      <p>{comprobante.indicaciones}</p>
      <p>{mensajesCorreo[comprobante.envioCorreo]}</p>
      <Link to="/talleres">Volver a talleres</Link>
    </section>
  );
}
