/**
 * Exchange Rate Service
 * Handles VND to Crypto conversion
 */

interface ExchangeRates {
  USDT: number;
  USDC: number;
  BNB: number;
  ETH: number;
}

export class ExchangeRateService {
  private rates: ExchangeRates;
  private lastUpdate: Date;
  private updateInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Initialize with default rates
    this.rates = {
      USDT: 25000, // 1 USDT = 25,000 VND
      USDC: 25000, // 1 USDC = 25,000 VND
      BNB: 15000000, // 1 BNB = 15,000,000 VND
      ETH: 85000000 // 1 ETH = 85,000,000 VND
    };
    this.lastUpdate = new Date();

    // Start auto-update
    this.startAutoUpdate();
  }

  /**
   * Get current exchange rates
   */
  getRates(): ExchangeRates {
    return { ...this.rates };
  }

  /**
   * Get rate for specific token
   */
  getRate(token: string): number {
    const upperToken = token.toUpperCase() as keyof ExchangeRates;
    return this.rates[upperToken] || 25000;
  }

  /**
   * Convert VND to crypto
   */
  convertVNDToCrypto(vndAmount: number, token: string): number {
    const rate = this.getRate(token);
    return vndAmount / rate;
  }

  /**
   * Convert crypto to VND
   */
  convertCryptoToVND(cryptoAmount: number, token: string): number {
    const rate = this.getRate(token);
    return cryptoAmount * rate;
  }

  /**
   * Fetch latest rates from external API
   * In production, use real API like CoinGecko, Binance API, etc.
   */
  private async fetchRates(): Promise<void> {
    try {
      console.log("💱 Fetching latest exchange rates...");

      // TODO: Replace with real API call
      // Example: CoinGecko API
      // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,binancecoin,ethereum&vs_currencies=vnd');
      // const data = await response.json();

      // For now, use mock data with slight variation
      const variation = 1 + (Math.random() - 0.5) * 0.02; // ±1% variation

      this.rates = {
        USDT: Math.round(25000 * variation),
        USDC: Math.round(25000 * variation),
        BNB: Math.round(15000000 * variation),
        ETH: Math.round(85000000 * variation)
      };

      this.lastUpdate = new Date();
      console.log("✅ Exchange rates updated:", this.rates);
    } catch (error) {
      console.error("❌ Failed to fetch exchange rates:", error);
    }
  }

  /**
   * Start auto-update timer
   */
  private startAutoUpdate(): void {
    setInterval(() => {
      this.fetchRates();
    }, this.updateInterval);

    console.log("🔄 Exchange rate auto-update started (every 5 minutes)");
  }

  /**
   * Get last update time
   */
  getLastUpdate(): Date {
    return this.lastUpdate;
  }

  /**
   * Force update rates
   */
  async forceUpdate(): Promise<void> {
    await this.fetchRates();
  }
}

// Singleton instance
let exchangeRateService: ExchangeRateService | null = null;

export function getExchangeRateService(): ExchangeRateService {
  if (!exchangeRateService) {
    exchangeRateService = new ExchangeRateService();
  }
  return exchangeRateService;
}
