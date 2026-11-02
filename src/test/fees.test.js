const request = require("supertest");
const fs = require("fs");
const app = require("../app");
const {FCS} = require("../data/dummyData");

describe("fee configuration endpoint",()=>{
  test("saves parsed configurations and confirms the result", async()=>{
    const spy=jest.spyOn(fs,"writeFileSync").mockImplementation(()=>undefined);
    try {
      const response=await request(app).post("/fees")
        .send({FeeConfigurationSpec:FCS}).set("Accept","application/json");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({status:"ok"});
      const saved=spy.mock.calls.filter(([name])=>typeof name==="string"&&name.endsWith("FeeConfig.json"));
      expect(saved.map(([name])=>name).sort()).toEqual(["generalFeeConfig.json","intlFeeConfig.json","loclFeeConfig.json"]);
      for(const [,data] of saved) expect(()=>JSON.parse(data)).not.toThrow();
    } finally {spy.mockRestore();}
  });
  test("refuses empty configuration without writing files",async()=>{
    const spy=jest.spyOn(fs,"writeFileSync").mockImplementation(()=>undefined);
    try {
      const response=await request(app).post("/fees").send({FeeConfigurationSpec:""});
      expect(response.status).toBe(400);
      expect(spy.mock.calls.filter(([name])=>typeof name==="string"&&name.endsWith("FeeConfig.json"))).toHaveLength(0);
    } finally {spy.mockRestore();}
  });
});
