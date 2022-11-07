const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const fs = require("fs");
const { getAppliedFee, getHighestSpecificConfig } = require("../utils/helper");
// const logger = require("../config/winston");

exports.feeParser = catchAsync((req, res, next) => {
  const { FeeConfigurationSpec } = req.body;
  console.log(req.body);
  if (!FeeConfigurationSpec) {
    return next(new AppError("NO configuration found", 400));
  }

  try {
    //Parses the config settings into a readable array of strings
    const readableConfig = FeeConfigurationSpec.replace(/\(/g, " ")
      .replace(/\)|APPLY\s|:\s/g, "")
      .split("\n");

    //Create json file for the sorted array
    const feeConfigFile = JSON.stringify(readableConfig, null, 1);
    fs.writeFileSync("feeConfig.json", feeConfigFile);

    res.status(200).json({ status: "ok" });
  } catch (err) {
    // logger.error(JSON.stringify(err));
    return next();
  }
});

exports.getTransactionFee = catchAsync((req, res, next) => {
  const transactionData = req.body;
  let configFile = [];
  try {
    const feeConfigFile = fs.readFileSync("feeConfig.json");
    configFile = JSON.parse(feeConfigFile);
  } catch (err) {
    // logger.error(JSON.stringify(err));
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
