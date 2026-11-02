const express = require("express");
const feeRoutes = require("./route/feeroute");

const app = express();

app.use(express.json());

app.use("/", feeRoutes);

app.use((err, req, res, next) => {
  const status = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode : 500;
  res.status(status).json({
    error: status === 500 ? "An unexpected error occurred" : err.message,
  });
});

module.exports = app;
