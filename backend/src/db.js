import pg from 'pg';

let pool;

export function db() {
  if (!process.env.DATABASE_URL) {
    throw Object.assign(new Error('El servidor aún no tiene configurada la base de datos.'), { status: 503 });
  }

  pool ??= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    statement_timeout: 5000,
  });

  return pool;
}
