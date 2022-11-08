const { config } = require("dotenv");
const { transactionData } = require("../model/model");

const f = [
  "LNPY1221 NGN * * * PERC 1.4",
  "LNPY1222 NGN INTL CREDIT-CARD VISA PERC 5.0",
  "LNPY1223 NGN LOCL CREDIT-CARD * FLAT_PERC 50:1.4",
  "LNPY1224 NGN * BANK-ACCOUNT * FLAT 100",
  "LNPY1225 NGN * USSD MTN PERC 0.55",
];

const differentiateArrays = (feeConfigArr) => {
  const intlArray = [];
  const localArray = [];

  for (let config of feeConfigArr) {
    config = config.split(" ");
    const [, , location, , , ,] = config;
    // console.log(location);
    if (location === "INTL" || location === "*") {
      intlArray.push(config);
    }
  }
  for (let config of feeConfigArr) {
    config = config.split(" ");
    const [, , location, , , ,] = config;
    // console.log(location);
    if (location === "LOCL" || location === "*") {
      localArray.push(config);
    }
  }

  return [intlArray, localArray];
};

const getConfig = (PaymentEntity, feeConfigArr) => {
  const { ID, Issuer, Brand, Number, SixID, Type, Country } = PaymentEntity;
  switch (Type) {
    //Narrowing down cases based on priorities on feeConfig
    case "CREDIT-CARD":
      if (Brand === "VISA") {
        //loop through to get specific feeConfig
        for (let configArr of feeConfigArr) {
          //get desired property for comparism
          const [, , , , feeConfigE_Prop] = configArr;

          if (Type === "CREDIT-CARD" && feeConfigE_Prop === "VISA") {
            return configArr;
          }
        }
      } else {
        // console.log(transaction_E_Prop);
        // console.log(transactionType);
        for (let configArr of feeConfigArr) {
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
          console.log(Type, Brand);

          if (feeConfigEntity === "CREDIT-CARD" && feeConfigE_Prop != "VISA") {
            return configArr;
          }
        }
      }
      break;
    case "BANK-ACCOUNT":
      for (let configArr of feeConfigArr) {
        const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
        if (feeConfigEntity === "BANK-ACCOUNT") {
          return configArr;
        }
      }
      break;
    case "USSD":
      if (Issuer === "MTN") {
        for (let configArr of feeConfigArr) {
          //get desired property for comparism
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
          if (Type === "USSD" && feeConfigE_Prop === "MTN") {
            return configArr;
          }
        }
      } else {
        for (let configArr of feeConfigArr) {
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
          console.log(feeConfigEntity);

          if (feeConfigE_Prop != "MTN") {
            console.log("boy");
            return configArr;
          }
        }
      }
      break;
    default:
      for (let configArr of feeConfigArr) {
        const [, , , , feeConfigE_Prop] = configArr;

        if (feeConfigE_Prop === "*") {
          return configArr;
        }
      }
  }
};

/**
 * @param {String} feeType the feeType value
 * @param {String} feeValue the feeValue value
 * @param {Number} transactionAmount amount from thetransaction
 * @returns appliedFee
 */
const getAppliedFee = (feeType, feeValue, transactionAmount) => {
  let appliedFee = 0;

  if (feeType === "PERC") {
    appliedFee = (Number(feeValue) * transactionAmount) / 100;
  } else if (feeType === "FLAT_PERC") {
    let value = feeValue.split(":");
    appliedFee =
      Number(value[0]) + (Number(value[1]) * transactionAmount) / 100;
  } else if (feeType === "FLAT") {
    appliedFee = Number(feeValue);
  }

  return appliedFee;
};

/**
 *
 * @param {Object} transactionPayload the transaction payload
 * @param {Array} feeConfig the fee configuration spec
 * @returns config array with matching config for a transactiion
 */
const getHighestSpecificConfig = (transactionPayload, feeConfig) => {
  return getConfig(transactionPayload.PaymentEntity, feeConfig);
};

module.exports = {
  getHighestSpecificConfig,
  getAppliedFee,
  getConfig,
  differentiateArrays,
};
