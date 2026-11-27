CREATE TABLE IF NOT EXISTS preinscripciones (
  folio text PRIMARY KEY,
  taller_id text NOT NULL,
  sesion_id text NOT NULL,
  nombre text NOT NULL,
  correo text NOT NULL,
  estado text NOT NULL DEFAULT 'recibida'
    CHECK (estado IN ('recibida', 'confirmada')),
  creada_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (taller_id, sesion_id, correo)
);

CREATE INDEX IF NOT EXISTS preinscripciones_confirmadas_por_sesion
  ON preinscripciones (taller_id, sesion_id)
  WHERE estado = 'confirmada';
