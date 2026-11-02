# Lannister Pay — transaction fee API

An earlier personal Node.js exercise that calculates a fee from a configuration and a transaction. I am improving its validation, test coverage and documentation before considering it for the portfolio.

## Getting started

```sh
npm install
npm test
npm start
```

The server uses `PORT` if set; otherwise see `index.js` for the configured port. The API has two POST endpoints:

- `/fees`: receives a `FeeConfigurationSpec` string and saves parsed local fee configuration.
- `/compute-transaction-fee`: receives an amount, customer fee flag and payment entity details, then returns fee, charge and settlement amounts.

A representative transaction structure:

```json
{
  "Currency": "NGN",
  "CurrencyCountry": "NG",
  "Amount": 1000,
  "Customer": {"BearsFee": true},
  "PaymentEntity": {"Country": "NG", "Type": "BANK-ACCOUNT"}
}
```

The API now returns validation errors instead of attempting a calculation with missing fields or a string amount. The `npm test` command checks malformed payloads, unsupported currency, and a fixed-fee calculation.

## Limitations and next work

**This is not a production payment service.** Configuration is stored in local files; it is not durable across containers or safe for concurrent writers. Amount math uses JavaScript floating-point numbers, not an exact decimal/cents representation. The fee matching rules and configuration grammar also require independent property-based and integration testing, and there is no authentication or tenant separation. Do not deploy this service to process real money or publish it as a financial system.

Next: immutable in-memory fee rules loaded from a validated store, safe configuration concurrency, exact minor-unit arithmetic, comprehensive configuration precedence tests and end-to-end verification.
