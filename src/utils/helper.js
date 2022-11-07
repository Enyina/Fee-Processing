const { transactionData } = require("../model/model");

const getConfig = (PaymentEntity, feeConfigArr) => {
  const { ID, Issuer, Brand, Number, SixID, Type, Country } = PaymentEntity;
  switch (Type) {
    //Narrowing down cases based on priorities on feeConfig
    case "CREDIT-CARD":
      if (Brand === "VISA") {
        //loop through to get specific feeConfig
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          //get desired property for comparism
          const [, , , , feeConfigE_Prop] = configArr;

          if (Type === "CREDIT-CARD" && feeConfigE_Prop === "VISA") {
            return configArr;
          }
        }
      } else {
        // console.log(transaction_E_Prop);
        // console.log(transactionType);
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
          console.log(Type, Brand);

          if (feeConfigEntity === "CREDIT-CARD" && feeConfigE_Prop != "VISA") {
            return configArr;
          }
        }
      }
      break;
    case "BANK-ACCOUNT":
      for (let item of feeConfigArr) {
        const configArr = item.split(" ");
        const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
        if (feeConfigEntity === "BANK-ACCOUNT") {
          return configArr;
        }
      }
      break;
    case "USSD":
      if (Issuer === "MTN") {
        // console.log(transactionType, transaction_E_Prop);
        for (let item of feeConfigArr) {
          const configArr = item.split(" ");
          //get desired property for comparism
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;
          if (Type === feeConfigEntity && feeConfigE_Prop === "MTN") {
            return configArr;
          }
        }
      } else {
        for (let item of feeConfigArr) {
          // console.log(transactionType, transaction_E_Prop);
          console.log(item);
          const configArr = item.split(" ");
          const [, , , feeConfigEntity, feeConfigE_Prop] = configArr;

          if (Issuer != feeConfigE_Prop) {
            console.log("boy");
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
    return getConfig(transactionPayload.PaymentEntity, feeConfig);
  } else if (locale === "LOCL") {
    return getConfig(transactionPayload.PaymentEntity, feeConfig);
  } else {
    return getConfig(transactionPayload.PaymentEntity, feeConfig);
  }
};

module.exports = {
  getHighestSpecificConfig,
  getAppliedFee,
  getConfig,
};
