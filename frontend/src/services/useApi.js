import { useEffect, useState } from 'react';

export default function useApi(url) {
  const [resultado, setResultado] = useState({ cargando: true });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(response => {
        if (response.status === 404) throw new Error('Taller no encontrado.');
        if (!response.ok) throw new Error('La consulta no pudo completarse.');
        return response.json();
      })
      .then(datos => {
        if (!controller.signal.aborted) setResultado({ datos });
      })
      .catch(error => {
        if (!controller.signal.aborted) setResultado({ error: error.message });
      });

    return () => controller.abort();
  }, [url]);

  return resultado;
}
