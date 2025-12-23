import app from './app';
import { ENV } from './utils/env';
import { getBlockchainService, getExchangeRateService } from './services/blockchain';

// Initialize blockchain services
const blockchainService = getBlockchainService();
const exchangeRateService = getExchangeRateService();

// Start blockchain event listener
blockchainService.startListening().catch((error) => {
  console.error('Failed to start blockchain listener:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await blockchainService.cleanup();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await blockchainService.cleanup();
  process.exit(0);
});

app.listen(ENV.PORT, () => {
  console.log(`API listening on http://localhost:${ENV.PORT}`);
  console.log('🔗 Blockchain services initialized');
  console.log('💱 Exchange rate service running');
});
