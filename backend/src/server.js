import express from 'express';
import organizador from './routes/organizador.js';
import { consultarCupos } from './services/cupos.js';
import preinscripciones from './routes/preinscripciones.js';
import { talleres } from './data/talleres.js';

const app = express();

app.use('/api/preinscripciones', express.json({ limit: '8kb' }), preinscripciones);

app.use('/api/organizador', organizador);

app.get('/api/talleres', async (_request, response) => {
  response.set('Cache-Control', 'no-store');
  return response.json(await consultarCupos(talleres));
});

app.get('/api/talleres/:id', async (request, response) => {
  const taller = talleres.find(item => item.id === request.params.id);
  if (!taller) return response.status(404).json({ error: 'Taller no encontrado.' });
  response.set('Cache-Control', 'no-store');
  const [actualizado] = await consultarCupos([taller]);
  return response.json(actualizado);
});

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  const status = error.status >= 400 && error.status < 600 ? error.status : 503;
  if (status >= 500) console.error('Error en la API:', error.code ?? 'sin código');
  return response.status(status).json({
    error: status < 500 ? error.message : 'El servicio no está disponible por ahora.',
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API lista en el puerto ${port}`));
