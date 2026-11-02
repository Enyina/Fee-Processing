const {test} = require("node:test");
const assert = require("node:assert/strict");
const {calculate,minor,basisPoints,format} = require("./calc.js");

const example = {amount:"1000.00",fixed:"25.00",rate:"1.50",cap:"100.00",payer:"customer"};

test("client fee illustration uses precise integer arithmetic",()=>{
  assert.equal(minor("0.01","Amount"),1n);
  assert.equal(minor("1000.25","Amount"),100025n);
  assert.equal(format(100025n),"₦1,000.25");
  assert.equal(basisPoints("1.50"),150n);
  assert.equal(basisPoints("100"),10000n);
  assert.equal(basisPoints("0.01"),1n);
});
test("customer pays the fee without changing the merchant amount",()=>{
  assert.deepEqual(calculate(example),{
    fee:"₦40.00",charge:"₦1,040.00",settlement:"₦1,000.00",
    explanation:"The customer pays the amount plus the illustrated fee."
  });
});
test("merchant-paid fee reduces settlement",()=>{
  const result=calculate({...example,payer:"merchant"});
  assert.equal(result.fee,"₦40.00");
  assert.equal(result.charge,"₦1,000.00");
  assert.equal(result.settlement,"₦960.00");
});
test("caps, percent rounding and maximum rate are explicit",()=>{
  const capped=calculate({...example,cap:"30.00"});
  assert.equal(capped.fee,"₦30.00");
  const rounded=calculate({amount:"1.00",fixed:"0",rate:"0.50",cap:"",payer:"customer"});
  assert.equal(rounded.fee,"₦0.01");
  assert.equal(calculate({amount:"1.00",fixed:"0",rate:"100",cap:"",payer:"customer"}).charge,"₦2.00");
});
test("bad or unsafe data fails rather than becoming a fee",()=>{
  for(const amount of ["-1","1e9","1.001","Infinity","", "1000000000","<img>"]){
    assert.throws(()=>calculate({...example,amount}),/Amount/);
  }
  for(const rate of ["101","-1","1.234","3e2",""]){
    assert.throws(()=>calculate({...example,rate}),/Rate/);
  }
  assert.throws(()=>calculate({...example,payer:"unknown"}),/Choose who pays/);
  assert.throws(()=>calculate({amount:"1.00",fixed:"5.00",rate:"0",cap:"",payer:"merchant"}),/cannot exceed/);
});
test("public demo contains no network calls or operational credentials",()=>{
  const fs=require("node:fs");const path=require("node:path");
  for(const file of ["index.html","app.js","calc.js","styles.css"]){
    const text=fs.readFileSync(path.join(__dirname,file),"utf8");
    assert.doesNotMatch(text,/\bfetch\(|XMLHttpRequest|api\.famasi|dispensaryapi|gho_[A-Za-z0-9]{12}|sk-[A-Za-z0-9]{16}/i);
  }
});
