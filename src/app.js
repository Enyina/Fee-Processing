const express = require("express");
const feeRoutes = require("./route/feeroute");

const app = express();

app.use(express.json());

app.use("/", feeRoutes);

module.exports = app;
