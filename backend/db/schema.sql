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
