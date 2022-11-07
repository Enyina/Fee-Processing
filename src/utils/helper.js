const { transactionData } = require("../model/model");

const getConfig = (transactionType, transaction_E_Prop, feeConfigArr) => {
  switch (transactionType) {
    //Narrowing down cases based on priorities on feeConfig
    case "CREDIT-CARD":
      if (transaction_E_Prop === "VISA") {
        //loop through to get specific feeConfig
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          //get desired property for comparism
          const [, , , , feeConfigE_Prop] = configArr;

          if (feeConfigE_Prop != "VISA") {
            return configArr;
          }
        }
      } else {
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          const [, , , , feeConfigE_Prop] = configArr;

          if (feeConfigE_Prop != "VISA") {
            return configArr;
          }
        }
      }
      break;
    case "BANK-ACCOUNT":
      for (let item of feeConfigArr) {
        const configArr = item.split(" ");
        return configArr;
      }
      break;
    case "USSD":
      if (transaction_E_Prop === "MTN") {
        //loop through to get specific feeConfig
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          //get desired property for comparism
          const [, , , , feeConfigE_Prop] = configArr;

          if (feeConfigE_Prop != "MTN") {
            return configArr;
          }
        }
      } else {
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          const [, , , , feeConfigE_Prop] = configArr;

          if (feeConfigE_Prop != "MTN") {
            return configArr;
          }
        }
      }
      break;
    default:
      for (let item of feeConfigArr) {
        const configArr = item.split(" ");
        const [, , , , feeConfigE_Prop] = configArr;

        if (feeConfigE_Prop === "*") {
          return configArr;
        }
      }
  }
};

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
  const { ID, Issuer, Brand, Number, SixID, Type, Country } =
    transactionPayload.PaymentEntity;
  const { CurrencyCountry } = transactionPayload;
  //   const locale = CurrencyCountry.startsWith("NG") ? "LOCL" : "INTL";
  const locale = CurrencyCountry === Country ? "LOCL" : "INTL";

  if (locale === "INTL") {
    return getConfig(Type, ID || Issuer || Brand || Number || SixID, feeConfig);
  } else if (locale === "LOCL") {
    return getConfig(Type, ID || Issuer || Brand || Number || SixID, feeConfig);
  } else {
    return getConfig(Type, ID || Issuer || Brand || Number || SixID, feeConfig);
  }
};

module.exports = {
  getHighestSpecificConfig,
  getAppliedFee,
};
