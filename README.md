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

