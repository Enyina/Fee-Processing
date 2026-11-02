const {getAppliedFee, getHighestSpecificConfig, differentiateArrays} = require("../utils/helper");

describe("fee selection and calculation helpers",()=>{
  test("selects a matching USSD issuer before generic rules",()=>{
    const configs=[
      ["general","NGN","*","*","*","PERC","1.4"],
      ["ussd-mtn","NGN","LOCL","USSD","MTN","PERC","0.55"],
    ];
    const selected=getHighestSpecificConfig({PaymentEntity:{Type:"USSD",Issuer:"MTN"}},configs);
    expect(selected[0]).toBe("ussd-mtn");
  });
  test("computes fixed, percentage and combined fees",()=>{
    expect(getAppliedFee("FLAT","100",5000)).toBe(100);
    expect(getAppliedFee("PERC","1.4",5000)).toBe(70);
    expect(getAppliedFee("FLAT_PERC","50:1.4",5000)).toBe(120);
  });
  test("classifies fee rules without losing a local rule",()=>{
    const input=[
      "a NGN LOCL BANK-ACCOUNT * FLAT 100",
      "b NGN INTL CREDIT-CARD VISA PERC 5",
    ];
    const [intl,local]=differentiateArrays(input);
    expect(local.some(row=>row[0]==="a")).toBe(true);
    expect(intl.some(row=>row[0]==="b")).toBe(true);
  });
});
