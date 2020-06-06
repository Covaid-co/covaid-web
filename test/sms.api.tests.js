process.env.NODE_ENV = "test";
const sms = require("../util/send_sms");
// const request = require("supertest");
// const sinon = require("sinon");
// const faker = require("faker");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = "+12513206732";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
// const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

describe("SMS Notifications -> ", function () {
  describe("Send match volunteer text -> ", function () {
    describe("Twilio acct details are correct -> ", function () {
      it("Correct details -> expect SMS to be sent", async () => {
        const data = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: authToken,
        };
        const result = await sms.sendVolunteerMatchText(data);

        expect(result.desc).to.include(
          "**TESTING MODE** SMS notification sent! Message recap:"
        );
        expect(result.isValid).to.be.true;
      });
    });
    describe("Twilio acct details are correctly formatted but are invalid -> ", function () {
      describe("Recipient Number -> ", function () {
        it("Correct format, made up number -> expect invalid recipient error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "1128804191",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid recipient phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: false,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
      });
      describe("Twilio Number -> ", function () {
        it("Correct format, made up number -> expect invalid twilio number error message", async () => {
          const data = {
            smsRecipient: "6308804191",
            from: "1128804191",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid Twilio phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: false,
            },
            isValid: false,
          });
        });
      });
      describe("Account SID -> ", function () {
        it("34 alphanumeric digits but invalid -> expect bad twilio account SID error message", async () => {
          const data = {
            smsRecipient: "6308804191",
            from: twilioNumber,
            sid: "ACfe259de31150483a8c88012d611b92f0",
            token: authToken,
          };
          expect(async () => {
            await sms.sendVolunteerMatchText(data);
          }).to.throw(new Error("Authenticate"));
        });
      });
      describe("Auth Token -> ", function () {
        it("32 alphanumeric digits but invalid -> expect bad twilio account SID error message", async () => {
          const data = {
            smsRecipient: "6308804191",
            from: twilioNumber,
            sid: accountSid,
            token: "d67b903ec1870c2585e11a6d737b38ca",
          };

          expect(async function () {
            await sms.sendVolunteerMatchText(data);
          }).to.throw(Error, "Authenticate");
        });
      });
    });
    describe("Twilio acct details missing or blank -> ", function () {
      it("No recipient specified ->  expect no recipient error message", async () => {
        const undefinedData = {
          from: twilioNumber,
          sid: accountSid,
          token: authToken,
        };
        const undefinedResult = await sms.sendVolunteerMatchText(undefinedData);
        expect(undefinedResult).to.eql({
          desc: "SMS Error: No recipient phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: false,
            isValid: false,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const nullData = {
          from: twilioNumber,
          recipient: null,
          sid: accountSid,
          token: authToken,
        };
        const nullResult = await sms.sendVolunteerMatchText(nullData);
        expect(nullResult).to.eql({
          desc: "SMS Error: No recipient phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: false,
            isValid: false,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const blankData = {
          from: twilioNumber,
          recipient: null,
          sid: accountSid,
          token: authToken,
        };
        const blankResult = await sms.sendVolunteerMatchText(blankData);
        expect(blankResult).to.eql({
          desc: "SMS Error: No recipient phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: false,
            isValid: false,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
      });

      it("Account SID nonexistent -> expect no SID error message", async () => {
        const undefinedData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          token: authToken,
        };
        const undefinedResult = await sms.sendVolunteerMatchText(undefinedData);
        expect(undefinedResult).to.eql({
          desc: "SMS Error: No Twilio account SID has been specified",
          sid: {
            exists: false,
            isValid: false,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const nullData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: null,
          token: authToken,
        };
        const nullResult = await sms.sendVolunteerMatchText(nullData);
        expect(nullResult).to.eql({
          desc: "SMS Error: No Twilio account SID has been specified",
          sid: {
            exists: false,
            isValid: false,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const blankData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: null,
          token: authToken,
        };
        const blankResult = await sms.sendVolunteerMatchText(blankData);
        expect(blankResult).to.eql({
          desc: "SMS Error: No Twilio account SID has been specified",
          sid: {
            exists: false,
            isValid: false,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
      });
      it("Auth token nonexistent -> expect details are valid", async () => {
        const undefinedData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: accountSid,
        };
        const undefinedResult = await sms.sendVolunteerMatchText(undefinedData);
        expect(undefinedResult).to.eql({
          desc: "SMS Error: No Twilio auth token has been specified",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: false,
            isValid: false,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const nullData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: null,
        };
        const nullResult = await sms.sendVolunteerMatchText(nullData);
        expect(nullResult).to.eql({
          desc: "SMS Error: No Twilio auth token has been specified",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: false,
            isValid: false,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
        const blankData = {
          from: twilioNumber,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: null,
        };
        const blankResult = await sms.sendVolunteerMatchText(blankData);
        expect(blankResult).to.eql({
          desc: "SMS Error: No Twilio auth token has been specified",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: false,
            isValid: false,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: true,
            isValid: true,
          },
          isValid: false,
        });
      });

      it("Twilio number nonexistent -> expect details are valid", async () => {
        const undefinedData = {
          from: null,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: authToken,
        };
        const undefinedResult = await sms.sendVolunteerMatchText(undefinedData);
        expect(undefinedResult).to.eql({
          desc: "SMS Error: No Twilio phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: false,
            isValid: false,
          },
          isValid: false,
        });
        const nullData = {
          from: null,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: authToken,
        };
        const nullResult = await sms.sendVolunteerMatchText(nullData);
        expect(nullResult).to.eql({
          desc: "SMS Error: No Twilio phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: false,
            isValid: false,
          },
          isValid: false,
        });
        const blankData = {
          from: null,
          smsRecipient: "6308804191",
          sid: accountSid,
          token: authToken,
        };
        const blankResult = await sms.sendVolunteerMatchText(blankData);
        expect(blankResult).to.eql({
          desc: "SMS Error: No Twilio phone number has been specified.",
          sid: {
            exists: true,
            isValid: true,
          },
          token: {
            exists: true,
            isValid: true,
          },
          recipient: {
            exists: true,
            isValid: true,
          },
          from: {
            exists: false,
            isValid: false,
          },
          isValid: false,
        });
      });
    });
    describe("Incorrect formatting of Twilio account details -> ", function () {
      describe("Recipient number -> ", function () {
        it("11 digits, does not start with US country code 1 -> expect invalid recipient error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "26308804191",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid recipient phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: false,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
        it("9 digits -> expect invalid recipient error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "630880419",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid recipient phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: false,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });

        it('contains characters that are not numbers nor any of "+-()"-> expect invalid recipient error message', async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "+1 (630) 880.4191",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid recipient phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: false,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
      });
      describe("Twilio number -> ", function () {
        it("11 digits, does not start with US country code 1 -> expect invalid twilio number error message", async () => {
          const data = {
            smsRecipient: "6308804191",
            from: "62088041919",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid Twilio phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: false,
            },
            isValid: false,
          });
        });
        it("9 digits -> expect invalid twilio number error message", async () => {
          const data = {
            smsRecipient: "6308804191",
            from: "620880419",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid Twilio phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: false,
            },
            isValid: false,
          });
        });

        it('contains nonnumerical characters outside of "+-()" -> expect invalid twilio number error message', async () => {
          const data = {
            smsRecipient: "6308804191",
            from: "+1 (630) 880.4191",
            sid: accountSid,
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Invalid Twilio phone number.",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: false,
            },
            isValid: false,
          });
        });
      });
      describe("Account SID -> ", function () {
        it("35 digits -> expect bad SID error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: accountSid + "h",
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio account SID",
            sid: {
              exists: true,
              isValid: false,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
        it("33 digits -> expect bad SID error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: "ACee259de31150483a8c88012d611b92f",
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio account SID",
            sid: {
              exists: true,
              isValid: false,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
        it("contains non-alphanumerical characters -> expect bad SID error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: "A.ee259de31150483a8c88012d611b92f0",
            token: authToken,
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio account SID",
            sid: {
              exists: true,
              isValid: false,
            },
            token: {
              exists: true,
              isValid: true,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
      });
      describe("Auth Token -> ", function () {
        it("33 digits -> expect bad token error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: accountSid,
            token: authToken + "3",
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio auth token",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: false,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
        it("31 digits -> expect bad token error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: accountSid,
            token: "d7b903ec1870c2585e11a6d737b38ca",
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio auth token",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: false,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
        it("contains non-alphanumerical characters -> expect bad token error message", async () => {
          const data = {
            from: twilioNumber,
            smsRecipient: "6308804191",
            sid: accountSid,
            token: "6d-b903ec1870c2585e11a6d737b38ca",
          };
          const result = await sms.sendVolunteerMatchText(data);
          expect(result).to.eql({
            desc: "SMS Error: Bad Twilio auth token",
            sid: {
              exists: true,
              isValid: true,
            },
            token: {
              exists: true,
              isValid: false,
            },
            recipient: {
              exists: true,
              isValid: true,
            },
            from: {
              exists: true,
              isValid: true,
            },
            isValid: false,
          });
        });
      });
    });
  });
});
