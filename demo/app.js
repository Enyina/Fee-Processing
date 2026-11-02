const form = document.getElementById("fee-form");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");
const status = document.getElementById("status");
function update() {
  const fields = new FormData(form);
  try {
    const result = window.FeeDemo.calculate({
      amount: String(fields.get("amount") || ""),
      fixed: String(fields.get("fixed") || ""),
      rate: String(fields.get("rate") || ""),
      cap: String(fields.get("cap") || ""),
      payer: String(fields.get("payer") || ""),
    });
    errorBox.hidden = true;
    results.hidden = false;
    document.getElementById("fee-value").textContent = result.fee;
    document.getElementById("charge-value").textContent = result.charge;
    document.getElementById("settlement-value").textContent = result.settlement;
    document.getElementById("explanation").textContent = result.explanation;
    status.textContent = "Illustration updated.";
  } catch (error) {
    results.hidden = true;
    errorBox.hidden = false;
    errorBox.textContent = error.message;
    status.textContent = "Please correct the amount or fee settings.";
  }
}
form.addEventListener("input", update);
form.addEventListener("change", update);
form.addEventListener("submit", event => {event.preventDefault(); update();});
update();
