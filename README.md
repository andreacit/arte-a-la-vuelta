# Arte a la Vuelta

Prototipo académico para explorar talleres artísticos, artesanales y de oficios en la Zona Metropolitana de Guadalajara. La primera etapa incluye un inicio, un catálogo filtrable y fichas basadas en convocatorias publicadas, con sesiones y cupos de demostración.

## Ejecución local

Desde la raíz, instala las dependencias con `npm ci`. Después ejecuta en dos terminales:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Abre la URL que imprime Vite. El servidor de desarrollo redirige las solicitudes `/api` a Express en el puerto 3001. Compila el frontend con `npm run build`.

## Preinscripciones

Requiere Node.js 20.19 o posterior y una base PostgreSQL. Copia `backend/.env.example` a `backend/.env` y asigna la conexión a `DATABASE_URL`. Crea la tabla ejecutando el contenido de `backend/db/schema.sql` en tu base. Reinicia la API después de editar el archivo de entorno.

El formulario registra una preinscripción por correo y sesión. El folio acredita la recepción de la solicitud. El lugar se confirma en la sede, sujeto a disponibilidad, y el pago, si corresponde, se realiza ahí. Las sesiones y los folios de este proyecto son de demostración.

Para entregar el correo de prueba, configura un servidor SMTP con `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` y `SMTP_FROM`. Define una única cuenta de demostración en `SMTP_TEST_RECIPIENT`. Solo se intentará enviar a ese correo. Si la entrega está deshabilitada o falla, la solicitud queda guardada y la pantalla muestra el folio.
