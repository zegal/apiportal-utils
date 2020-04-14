const Utils = require("../../webhooks/utils");

const MockPAYLOAD = {
  _id: "docId",
  state: "draft",
  data: {
    data1: "abc",
  },
};
const MockTIMESTAMP = Math.floor(Date.now() / 1000);
const MockEXPIREDTIME = MockTIMESTAMP - 30 * 60;
const MockPAYLOADString = JSON.stringify(MockPAYLOAD);

describe("Utils for webhook functionality", () => {
  describe("isJsonValid", () => {
    it("should return true for stringified payload", () => {
      const json = Utils.isJsonValid(MockPAYLOADString);
      expect(json).toBeTruthy();
    });

    it("should return false for invalid payload and objects", () => {
      const json1 = Utils.isJsonValid(MockPAYLOAD);
      const json2 = Utils.isJsonValid("invalid");
      expect(json1).toBeFalsy();
      expect(json2).toBeFalsy();
    });
  });

  describe("Header related info", () => {
    const header = Utils.formatHeader("time", "hash");

    it("should return header in format `t=<timestamp>,h=<hash>`", () => {
      expect(header).toEqual("t=time,h=hash");
    });

    it("should parse formatted header", () => {
      const t = Utils.parseSignHeader(header, "t");
      const h = Utils.parseSignHeader(header, "h");
      expect(t).toEqual("time");
      expect(h).toEqual("hash");
    });
  });

  describe("Timestamp related info", () => {
    it("should return true/false accordingly within tolerance", () => {
      expect(Utils.isValidTime(MockTIMESTAMP)).toBeTruthy();
      expect(Utils.isValidTime(MockEXPIREDTIME)).toBeFalsy();
    });

    it("should make sure the timestamp is added in the stringified payload", () => {
      const header = Utils.addTimestampToPayload(
        MockTIMESTAMP,
        MockPAYLOADString
      ).split(",");
      expect(header[0]).toEqual(`${MockTIMESTAMP}`);
    });
  });
});
