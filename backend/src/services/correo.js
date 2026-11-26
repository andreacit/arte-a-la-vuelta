import nodemailer from 'nodemailer';

export async function enviarComprobante({ correo, folio, taller, sesion, indicaciones }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TEST_RECIPIENT } = process.env;

  if (!SMTP_HOST || !SMTP_FROM || correo !== SMTP_TEST_RECIPIENT?.trim().toLowerCase()) {
    return 'no_enviado';
  }

  const port = Number(SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 7000,
  });

  try {
    const envio = await transport.sendMail({
      from: SMTP_FROM,
      to: correo,
      subject: `Preinscripción de prueba · ${folio}`,
      text: [
        `Folio: ${folio}`,
        `Taller: ${taller.nombre}`,
        `Sesión de demostración: ${sesion.fecha} · ${sesion.horario}`,
        `Sede de referencia: ${taller.sede ?? taller.municipio}`,
        '',
        indicaciones,
      ].join('\n'),
    });
    return envio.accepted.length ? 'enviado' : 'error';
  } catch {
    console.error('No se pudo enviar el comprobante SMTP.');
    return 'error';
  }
}
