import { RealtimeGateway } from '../gateway/server.ts';

const port = process.env.GATEWAY_PORT ? parseInt(process.env.GATEWAY_PORT) : 4001;
const gateway = new RealtimeGateway({ port });

async function main() {
  await gateway.start();
  console.log(`🚀 Realtime Gateway active on http://localhost:${port}`);

  const shutdown = async () => {
    console.log('\nStopping Realtime Gateway...');
    await gateway.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Fatal gateway error:', err);
  process.exit(1);
});
