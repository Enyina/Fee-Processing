const router = require("express").Router();
const {
  feeParser,
  getTransactionFee,
} = require("../controllers/feeController");

router.post("/fees", feeParser);
router.post("/compute-transaction-fee", getTransactionFee);

module.exports = router;
