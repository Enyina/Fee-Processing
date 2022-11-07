const request = require("supertest");
const {
  getAppliedFee,
  getHighestSpecificConfig,
  getConfig,
} = require("../utils/helper");

const transactionPayload = {
  ID: 91203,
  Amount: 5000,
  Currency: "NGN",
  CurrencyCountry: "NG",
  Customer: {
    ID: 2211232,
    EmailAddress: "anonimized29900@anon.io",
    FullName: "Abel Eden",
    BearsFee: true,
  },
  PaymentEntity: {
    ID: 2203454,
    Issuer: "GTBANK",
    Brand: "MASTERCARD",
    Number: "530191******2903",
    SixID: 530191,
    Type: "CREDIT-CARD",
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
const brand = transactionPayload.PaymentEntity.Brand;

test("", () => {
  const ans = getConfig(type, brand, fsc);
  expect(ans).toBe({
    AppliedFeeID: "LNPY1223",
    AppliedFeeValue: 120,
    ChargeAmount: 5120,
    SettlementAmount: 5000,
  });
});
