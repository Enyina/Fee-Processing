const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const fs = require("fs");
const {
  getAppliedFee,
  getHighestSpecificConfig,
  differentiateArrays,
} = require("../utils/helper");

exports.feeParser = catchAsync((req, res, next) => {
  const { FeeConfigurationSpec } = req.body;
  // console.log(req.body);
  if (!FeeConfigurationSpec) {
    return next(new AppError("NO configuration found", 400));
  }

  try {
    //Parses the config settings into a readable array of strings
    const readableConfig = FeeConfigurationSpec.replace(/\(/g, " ")
      .replace(/\)|APPLY\s|:\s/g, "")
      .split("\n");

    const feeConfigFile = differentiateArrays(readableConfig);

    const intlConfigFile = JSON.stringify(feeConfigFile[0], null, 1);
    fs.writeFileSync("intlFeeConfig.json", intlConfigFile);

    const loclConfigFile = JSON.stringify(feeConfigFile[1], null, 1);
    fs.writeFileSync("loclFeeConfig.json", loclConfigFile);

    res.status(200).json({ status: "ok" });
  } catch (err) {
    // logger.error(JSON.stringify(err));
    return next();
  }
});

exports.getTransactionFee = catchAsync((req, res, next) => {
  const transactionData = req.body;
  if (transactionData.Currency === "USD") {
    res.status(400).json({
      Error: "No fee configuration for USD transactions.",
    });
  }
  let configFile = [];
  try {
    const { ID, Issuer, Brand, Number, SixID, Type, Country } =
      transactionData.PaymentEntity;
    const { CurrencyCountry, Currency } = transactionData;

    const locale = CurrencyCountry === Country ? "LOCL" : "INTL";

    if (locale === "INTL") {
      const feeConfigFile = fs.readFileSync("intlFeeConfig.json");
      configFile = JSON.parse(feeConfigFile);
      console.log(configFile);
    } else if (locale === "LOCL") {
      const feeConfigFile = fs.readFileSync("loclFeeConfig.json");
      configFile = JSON.parse(feeConfigFile);
      console.log(configFile);
    }
  } catch (err) {
    // logger.error(JSON.stringify(err));
    console.log(err);
    return next(new AppError("No fee configuration settings found", 500));
  }

  //get corresponding config setting from configFile
  const correspondingConfig = getHighestSpecificConfig(
    transactionData,
    configFile
  );
  if (!correspondingConfig) {
    // logger.error(JSON.stringify(err));
    return next(
      new AppError("No rates currently available for this transaction", 400)
    );
  }

  const [feeId, , , , , feeType, feeValue] = correspondingConfig;

  const appliedFee = getAppliedFee(feeType, feeValue, transactionData.Amount);
  const chargedAmount =
    transactionData.Amount +
    (transactionData.Customer.BearsFee ? appliedFee : 0);

  const settlementAmount = chargedAmount - appliedFee;

  res.status(200).json({
    AppliedFeeID: feeId,
    AppliedFeeValue: appliedFee,
    ChargeAmount: chargedAmount,
    SettlementAmount: settlementAmount,
  });
});
