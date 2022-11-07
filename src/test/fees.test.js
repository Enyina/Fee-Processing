const request = require("supertest");
const app = require("../app");
const dummyData = require("../data/dummyData");

describe("POST/fee", () => {
  test("should save an array of configs", () => {
    request(app)
      .post("/fees")
      .send({ FeeConfigurationSpec: dummyData.FCS })
      .set("Accept", "application/json")
      .expect((res) => {
        res.statusCode.toEqual(200);
        res.body.toHaveProperty("status");
        res.body.status.toEqual("ok");
      });
  });
});

describe("POST/compute-transaction-fee", () => {
  test(" should compute the exact fee for a transaction", async () => {
    request(app)
      .post("/compute-transaction-fee")
      .send({ FeeConfigurationSpec: dummyData.dummyData.computation1 })
      .set("Accept", "application/json")
      .expect((res) => {
        res.statusCode.toEqual(200);
        res.body.toEqual({
          AppliedFeeID: "LNPY1221",
          AppliedFeeValue: 70,
          ChargeAmount: 5070,
          SettlementAmount: 5000,
        });
      });
  });
});
