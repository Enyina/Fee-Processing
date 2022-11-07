const request = require("supertest");
const {
  getAppliedFee,
  getHighestSpecificConfig,
  getConfig,
} = require("../utils/helper");

const transactionPayload = {
  ID: 91204,
  Amount: 3500,
  Currency: "NGN",
  CurrencyCountry: "NG",
  Customer: {
    ID: 4211232,
    EmailAddress: "anonimized292200@anon.io",
    FullName: "Wenthorth Scoffield",
    BearsFee: false,
  },
  PaymentEntity: {
    ID: 2203454,
    Issuer: "AIRTEL",
    Brand: "",
    Number: "080234******2903",
    SixID: 180234,
    Type: "USSD",
    Country: "NG",
  },
};

const fsc = [
  "LNPY1221 NGN * * * PERC 1.4",
  "LNPY1222 NGN INTL CREDIT-CARD VISA PERC 5.0",
  "LNPY1223 NGN LOCL CREDIT-CARD * FLAT_PERC 50:1.4",
  "LNPY1224 NGN * BANK-ACCOUNT * FLAT 100",
  "LNPY1225 NGN * USSD MTN PERC 0.55",
];

const type = transactionPayload.PaymentEntity.Type;
// const brand = transactionPayload.PaymentEntity.Brand;
const brand = transactionPayload.PaymentEntity.Issuer;

test("", () => {
  const ans = getConfig(type, brand, fsc);
  expect(ans).toBe({
    AppliedFeeID: "LNPY1223",
    AppliedFeeValue: 120,
    ChargeAmount: 5120,
    SettlementAmount: 5000,
  });
});
