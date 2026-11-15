import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), '.pgdata');
const PORT = 54329;
const USER = 'nexus_user';
const PASSWORD = 'nexus_password';
const DATABASE = 'nexus_db';

const pg = new EmbeddedPostgres({
  port: PORT,
  databaseDir: DB_DIR,
  user: USER,
  password: PASSWORD,
  initialDatabase: DATABASE,
  persistent: true,
});

async function main() {
  const isInitialized = fs.existsSync(path.join(DB_DIR, 'PG_VERSION'));
  if (!isInitialized) {
    console.log('[PostgreSQL Server] Initialising new cluster in .pgdata...');
    await pg.initialise();
  }

  console.log(`[PostgreSQL Server] Starting PostgreSQL on port ${PORT}...`);
  await pg.start();
  console.log(`[PostgreSQL Server] Ready! postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}`);

  process.on('SIGINT', async () => {
    console.log('[PostgreSQL Server] Shutting down...');
    await pg.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[PostgreSQL Server] Shutting down...');
    await pg.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[PostgreSQL Server] Fatal error:', err);
  process.exit(1);
});
