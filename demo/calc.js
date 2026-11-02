/* Browser-only NGN fee illustration. Never used to initiate or settle payments. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FeeDemo = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  function minor(value, label) {
    if (typeof value !== "string" || !/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(value.trim())) {
      throw new Error(label + " must be a non-negative amount with up to two decimal places.");
    }
    const parts = value.trim().split(".");
    return BigInt(parts[0]) * 100n + BigInt((parts[1] || "").padEnd(2, "0"));
  }
  function basisPoints(value) {
    if (typeof value !== "string" || !/^(?:0|[1-9]\d{0,1})(?:\.\d{1,2})?$/.test(value.trim())) {
      throw new Error("Rate must be between 0 and 100 percent with up to two decimals.");
    }
    const bp = BigInt(value.trim().replace(".", "")) *
      (100n / (10n ** BigInt((value.split(".")[1] || "").length)));
    if (bp > 10000n) throw new Error("Rate must not exceed 100%.");
    return bp;
  }
  function format(value) {
    const sign = value < 0n ? "-" : "";
    const n = value < 0n ? -value : value;
    return sign + "₦" + (n / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + (n % 100n).toString().padStart(2, "0");
  }
  function calculate({amount, fixed, rate, cap, payer}) {
    const original = minor(amount, "Amount");
    const fixedMinor = minor(fixed, "Fixed fee");
    const rateBp = basisPoints(rate);
    const capMinor = cap === "" ? null : minor(cap, "Fee cap");
    if (payer !== "customer" && payer !== "merchant") throw new Error("Choose who pays the fee.");
    const percentage = (original * rateBp + 5000n) / 10000n;
    let fee = fixedMinor + percentage;
    if (capMinor !== null && fee > capMinor) fee = capMinor;
    if (payer === "merchant" && fee > original) throw new Error("Fee cannot exceed the payment when the merchant pays.");
    return {
      fee: format(fee),
      charge: format(payer === "customer" ? original + fee : original),
      settlement: format(payer === "merchant" ? original - fee : original),
      explanation: payer === "customer" ?
        "The customer pays the amount plus the illustrated fee." :
        "The fee comes out of the merchant's illustrated settlement."
    };
  }
  return {calculate, minor, basisPoints, format};
});
