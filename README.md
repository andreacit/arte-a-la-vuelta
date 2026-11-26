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
