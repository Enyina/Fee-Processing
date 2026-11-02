/**
 * Only normalize the shape needed for fee calculation.
 * Currency and payment rules are evaluated by the caller.
 * Amounts are numeric major-unit values in this legacy exercise;
 * do not use floating-point math for production money movement.
 */
function validateTransaction(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Transaction data must be an object";
  }
  if (typeof value.Amount !== "number" || !Number.isFinite(value.Amount) || value.Amount < 0) {
    return "Amount must be a non-negative number";
  }
  if (!value.PaymentEntity || typeof value.PaymentEntity !== "object" || Array.isArray(value.PaymentEntity) ||
      typeof value.PaymentEntity.Country !== "string" || !value.PaymentEntity.Country.trim()) {
    return "PaymentEntity.Country is required";
  }
  if (typeof value.CurrencyCountry !== "string" || !value.CurrencyCountry.trim()) {
    return "CurrencyCountry is required";
  }
  if (!value.Customer || typeof value.Customer !== "object" || Array.isArray(value.Customer) ||
      typeof value.Customer.BearsFee !== "boolean") {
    return "Customer.BearsFee must be a boolean";
  }
  return null;
}
module.exports = { validateTransaction };
