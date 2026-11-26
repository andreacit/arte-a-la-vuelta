import React, { useState } from 'react';
import TarjetaTaller from '../components/TarjetaTaller';
import useApi from '../services/useApi';

const campos = [
  ['municipio', 'Municipio'],
  ['disciplina', 'Disciplina'],
  ['tipo', 'Tipo de organizador'],
];

export default function Catalogo() {
  const { datos, cargando, error } = useApi('/api/talleres');
  const [filtros, setFiltros] = useState({});

  return (
    <>
      <h1>Talleres</h1>
      <p>Talleres basados en convocatorias publicadas. Las sesiones y los cupos del prototipo son de demostración.</p>
      {cargando && <p role="status">Cargando talleres…</p>}
      {error && <p role="alert">No se pudo cargar el catálogo. {error}</p>}
      {datos && (
        <>
          <div className="filtros">
            {campos.map(([campo, etiqueta]) => (
              <label key={campo}>
                {etiqueta}
                <select
                  value={filtros[campo] ?? ''}
                  onChange={event => setFiltros({ ...filtros, [campo]: event.target.value })}
                >
                  <option value="">Todas las opciones</option>
                  {[...new Set(datos.map(taller => taller[campo]))].sort().map(valor => (
                    <option key={valor}>{valor}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <Resultados talleres={datos} filtros={filtros} />
        </>
      )}
    </>
  );
}

function Resultados({ talleres, filtros }) {
  const visibles = talleres.filter(taller => campos.every(([campo]) =>
    !filtros[campo] || taller[campo] === filtros[campo],
  ));
  if (!visibles.length) return <p role="status">No hay talleres con esos filtros.</p>;
  return <div className="cuadricula">{visibles.map(taller => <TarjetaTaller key={taller.id} taller={taller} />)}</div>;
}
