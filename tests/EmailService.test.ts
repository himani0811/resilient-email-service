import { EmailService, Email } from "../src/EmailService";

class MockEmailProvider1 {
  name = "MockProvider1";
  async send(email: Email): Promise<boolean> {
    return true; // Always succeed
  }
}

class MockEmailProvider2 {
  name = "MockProvider2";
  async send(email: Email): Promise<boolean> {
    throw new Error("Forced failure");
  }
}

describe("EmailService", () => {
  const email: Email = {
    to: "user@example.com",
    subject: "Test Email",
    body: "This is a test email",
    idempotencyKey: "test-key-1",
  };

  it("should send email successfully with a working provider", async () => {
    const providers = [new MockEmailProvider1(), new MockEmailProvider2()];
    const service = new EmailService(providers);

    const result = await service.send(email);

    expect(result.status).toBe("success");
    expect(result.attempts).toBeGreaterThan(0);
    expect(result.providerUsed).toBe("MockProvider1");
  });

  it("should return same result for duplicate idempotency key", async () => {
    const providers = [new MockEmailProvider1()];
    const service = new EmailService(providers);

    await service.send(email); // First time
    const result = await service.send(email); // Second time, same key

    expect(result.status).toBe("success");
    expect(result.providerUsed).toBe("MockProvider1");
  });
});
