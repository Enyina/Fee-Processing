const request = require("supertest");
const fs = require("fs");
const app = require("../src/app");
const {validateTransaction} = require("../src/utils/validateTransaction");
const {getAppliedFee} = require("../src/utils/helper");

const base = {
  Currency: "NGN",
  CurrencyCountry: "NG",
  Amount: 1000,
  Customer: {BearsFee: true},
  PaymentEntity: {Country: "NG", Type: "BANK-ACCOUNT"},
};

describe("legacy fee API request safety", () => {
  test("requires a configuration string without throwing an asynchronous wrapper error", async () => {
    const response = await request(app).post("/fees").send({});
    expect(response.status).toBe(400);
  });

  test("rejects USD once without attempting to read a local config", async () => {
    const spy = jest.spyOn(fs, "readFileSync");
    try {
      const response = await request(app).post("/compute-transaction-fee")
        .send({...base, Currency: "USD"});
      expect(response.status).toBe(400);
      expect(response.body.Error).toMatch(/USD/);
      expect(spy).not.toHaveBeenCalled();
    } finally {spy.mockRestore();}
  });

  test.each([
    [{...base, Amount: "1000"}, "Amount"],
    [{...base, Amount: -1}, "Amount"],
    [{...base, PaymentEntity: null}, "PaymentEntity"],
    [{...base, Customer: {}}, "BearsFee"],
    [{...base, CurrencyCountry: ""}, "CurrencyCountry"],
  ])("rejects malformed payloads without reading configuration", async (payload, expected) => {
    const spy = jest.spyOn(fs, "readFileSync");
    try {
      const response = await request(app).post("/compute-transaction-fee").send(payload);
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(new RegExp(expected));
      expect(spy).not.toHaveBeenCalled();
    } finally {spy.mockRestore();}
  });

  test("computes a known fixed-fee example using numeric amounts", async () => {
    const actualRead = fs.readFileSync;
    const spy = jest.spyOn(fs,"readFileSync").mockImplementation((file, ...args) => {
      if (typeof file === "string" && file.endsWith("loclFeeConfig.json")) {
        return Buffer.from(JSON.stringify([["fixed-local", "", "LOCL", "BANK-ACCOUNT", "*", "FLAT", "100"]]));
      }
      return actualRead.call(fs, file, ...args);
    });
    try {
      const response = await request(app).post("/compute-transaction-fee").send(base);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        AppliedFeeID: "fixed-local",
        AppliedFeeValue: 100,
        ChargeAmount: 1100,
        SettlementAmount: 1000,
      });
    } finally {spy.mockRestore();}
  });
});

test("numeric preflight and fee helper behave predictably", () => {
  expect(validateTransaction(base)).toBe(null);
  expect(getAppliedFee("PERC","1.5",1000)).toBe(15);
  expect(getAppliedFee("FLAT_PERC","50:2",1000)).toBe(70);
  expect(getAppliedFee("FLAT","25",1000)).toBe(25);
});
