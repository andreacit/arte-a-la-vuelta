import express from 'express';
import { talleres } from './data/talleres.js';

const app = express();

app.get('/api/talleres', (_request, response) => response.json(talleres));

app.get('/api/talleres/:id', (request, response) => {
  const taller = talleres.find(item => item.id === request.params.id);
  if (!taller) return response.status(404).json({ error: 'Taller no encontrado.' });
  return response.json(taller);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API lista en el puerto ${port}`));
