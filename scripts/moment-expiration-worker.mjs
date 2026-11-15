import { MomentService } from '../src/modules/moments/services/momentService.ts';

const CHECK_INTERVAL_MS = 10000; // Check every 10 seconds

async function runExpirationWorker() {
  console.log('⏱️  [MomentExpirationWorker] Started automatic background expiration loop');

  const check = async () => {
    try {
      const expiredCount = await MomentService.checkAndExpireMoments();
      if (expiredCount > 0) {
        console.log(`[MomentExpirationWorker] Expired ${expiredCount} past-due moment(s)`);
      }
    } catch (err) {
      console.error('[MomentExpirationWorker] Error checking expired moments:', err);
    }
  };

  await check();
  const timer = setInterval(check, CHECK_INTERVAL_MS);

  const shutdown = () => {
    clearInterval(timer);
    console.log('[MomentExpirationWorker] Stopped');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

runExpirationWorker().catch((err) => {
  console.error('Fatal expiration worker error:', err);
  process.exit(1);
});
