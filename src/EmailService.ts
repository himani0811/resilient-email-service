// src/EmailService.ts

interface Email {
  to: string;
  subject: string;
  body: string;
  idempotencyKey: string;
}

interface EmailProvider {
  name: string;
  send(email: Email): Promise<boolean>;
}

interface EmailStatus {
  email: Email;
  status: 'success' | 'failed';
  attempts: number;
  lastError?: string;
  providerUsed: string;
}

class MockProviderA implements EmailProvider {
  name = 'MockProviderA';
  async send(email: Email): Promise<boolean> {
    if (Math.random() < 0.7) return true;
    throw new Error('Provider A failed');
  }
}

class MockProviderB implements EmailProvider {
  name = 'MockProviderB';
  async send(email: Email): Promise<boolean> {
    if (Math.random() < 0.5) return true;
    throw new Error('Provider B failed');
  }
}

class EmailService {
  private providers: EmailProvider[];
  private idempotencyCache = new Map<string, EmailStatus>();
  private rateLimitWindow = 10000; // 10 seconds
  private maxEmailsPerWindow = 5;
  private sentTimestamps: number[] = [];
  private circuitBreaker = new Map<string, { failures: number; open: boolean }>();
  private MAX_RETRIES = 3;
  private BACKOFF_BASE = 300;

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
    for (const p of providers) {
      this.circuitBreaker.set(p.name, { failures: 0, open: false });
    }
  }

  private log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  private delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  private rateLimitCheck(): boolean {
    const now = Date.now();
    this.sentTimestamps = this.sentTimestamps.filter(t => now - t < this.rateLimitWindow);
    return this.sentTimestamps.length < this.maxEmailsPerWindow;
  }

  async send(email: Email): Promise<EmailStatus> {
    if (this.idempotencyCache.has(email.idempotencyKey)) {
      this.log(`Idempotent request detected. Returning cached status.`);
      return this.idempotencyCache.get(email.idempotencyKey)!;
    }

    if (!this.rateLimitCheck()) {
      const status: EmailStatus = {
        email,
        status: 'failed',
        attempts: 0,
        lastError: 'Rate limit exceeded',
        providerUsed: 'none'
      };
      this.idempotencyCache.set(email.idempotencyKey, status);
      return status;
    }

    for (const provider of this.providers) {
      const circuit = this.circuitBreaker.get(provider.name)!;
      if (circuit.open) {
        this.log(`Circuit breaker open for ${provider.name}, skipping.`);
        continue;
      }

      let attempt = 0;
      while (attempt < this.MAX_RETRIES) {
        try {
          await this.delay(this.BACKOFF_BASE * 2 ** attempt);
          if (await provider.send(email)) {
            const status: EmailStatus = {
              email,
              status: 'success',
              attempts: attempt + 1,
              providerUsed: provider.name
            };
            this.sentTimestamps.push(Date.now());
            this.idempotencyCache.set(email.idempotencyKey, status);
            this.circuitBreaker.set(provider.name, { failures: 0, open: false });
            return status;
          }
        } catch (e: any) {
          this.log(`${provider.name} failed on attempt ${attempt + 1}: ${e.message}`);
          attempt++;
          circuit.failures++;
          if (circuit.failures >= 3) {
            circuit.open = true;
            this.log(`Circuit breaker tripped for ${provider.name}`);
            break;
          }
        }
      }
    }

    const status: EmailStatus = {
      email,
      status: 'failed',
      attempts: this.MAX_RETRIES * this.providers.length,
      lastError: 'All providers failed',
      providerUsed: 'none'
    };
    this.idempotencyCache.set(email.idempotencyKey, status);
    return status;
  }
}

export { EmailService, MockProviderA, MockProviderB, Email };
