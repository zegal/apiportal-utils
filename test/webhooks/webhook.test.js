const Sign = require("../../webhooks/sign");
const Utils = require("../../webhooks/utils");
const { verifyWebhookEvent } = require("../../webhooks/verifyWebhook");
const MockSECRET = "secret";
const MockSIG = "t=34242343,h=skdjsjfjksdjfndskjnfkjdsnckj";
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

describe("Webhooks", () => {
  // hash generation process
  describe("generateSignedHeader", () => {
    it("should correctly generate a webhook header with timestamp and hash", () => {
      const header = Sign.generateSignedHeader(
        MockPAYLOADString,
        MockSECRET,
        MockTIMESTAMP
      );
      expect(header).toBeDefined();
      expect(header.split(",")).toHaveLength(2);
      const headerParts = {
        timestamp: Utils.parseSignHeader(header, "t"),
        hash: Utils.parseSignHeader(header, "h"),
      };
      expect(headerParts.timestamp).toBeDefined();
      expect(headerParts.hash).toBeDefined();
    });
  });

  // verification process
  describe("verifyWebhookEvent", () => {
    it("should throw error for invalid json payload", async () => {
      await expect(
        verifyWebhookEvent("invalid payload", MockSIG, MockSECRET)
      ).rejects.toThrow(/Error in parsing payload/);
    });

    it("should throw error if header or secret is not given", async () => {
      await expect(verifyWebhookEvent(MockPAYLOADString)).rejects.toThrow(
        /No data to verify/
      );
    });

    it("should return true if signature match with expected", async () => {
      const header = Sign.generateSignedHeader(
        MockPAYLOADString,
        MockSECRET,
        MockTIMESTAMP
      );
      await expect(
        verifyWebhookEvent(MockPAYLOADString, header, MockSECRET)
      ).resolves.toBeTruthy();
    });
    it("should throw error if signature is verified but time is expired", async () => {
      const header = Sign.generateSignedHeader(
        MockPAYLOADString,
        MockSECRET,
        MockEXPIREDTIME
      );
      await expect(
        verifyWebhookEvent(MockPAYLOADString, header, MockSECRET)
      ).rejects.toThrow(/The validation time has been expired/);
    });
  });
});
