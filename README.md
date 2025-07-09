# 📧 Resilient Email Service

A fault-tolerant, scalable, and production-grade email delivery service built with TypeScript. It includes **retry logic**, **idempotency**, **rate limiting**, **circuit breaker**, and **fallback providers** — ensuring email delivery even when some providers fail.

---

## 🚀 Features

- ✅ **Retry Logic**: Retries failed requests with exponential backoff.
- ♻️ **Fallback Providers**: Automatically switches to backup providers on failure.
- 🧠 **Circuit Breaker**: Skips consistently failing providers for a cooldown period.
- 🔁 **Idempotency**: Guarantees that duplicate requests don’t send duplicate emails.
- 📉 **Rate Limiting**: Limits the number of emails sent in a time window.
- 🧪 **Unit Tests**: Ensures correctness using Jest + ts-jest.

---

## 🛠 Technologies Used

- TypeScript
- Node.js
- Jest (unit testing)
- ts-node
- Git + GitHub

---

## 📂 Project Structure
resilient-email-service/
├── src/
│ └── EmailService.ts # Core logic
├── tests/
│ └── EmailService.test.ts # Unit tests
├── package.json
├── tsconfig.json
└── jest.config.js
📌 Usage Example
You can use the EmailService class by providing one or more email providers and calling the send() method:

ts
Copy
Edit
const email: Email = {
  to: "user@example.com",
  subject: "Welcome",
  body: "Thanks for signing up!",
  idempotencyKey: "unique-key-123"
};

const service = new EmailService([new MockProviderA(), new MockProviderB()]);
const result = await service.send(email);
console.log(result);
🙌 Acknowledgments
Built with 💙 by Himani Bisen
For learning, growth, and contributions to open-source engineering.

