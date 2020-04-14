const utils = require("./utils");
const { generateSignedHeader, compareSignature } = require("./sign");
// As long as the secret is never leaked then the signature generated can only change if the payload changes
/**
 * Verify that the payload is from Zegal
 * @param {Object} payload payload object to verify if it is sent from Zegal
 * @param {String} sigHeader signature from Zegal signature header with format "t=<timestamp>,h=<hash>"
 * @param {String} secretKey api-user secret key
 */
const verifyWebhookEvent = async (payload, sigHeader, secretKey) => {
  try {
    // check if json is valid >> request promise sends paresed data 
    // if (!utils.isJsonValid(payload)) throw "Error in parsing payload";

    if (!payload || !sigHeader || !secretKey) {
      throw "No data to verify: secret, payload, publicKey is required";
    }

    // split sigHeader to time and hash
    let sig = {
      timestamp: utils.parseSignHeader(sigHeader, "t"),
      hash: utils.parseSignHeader(sigHeader, "h"),
    };

    // check if the sigHeader generated from this payload will equal to provided sigHeader or not
    const expectedSignedHeader = await generateSignedHeader(
      payload,
      secretKey,
      sig.timestamp
    );
    // check for verification
    const isVerified = compareSignature(sigHeader, expectedSignedHeader);
    if (!isVerified) {
      throw `Signature ${sigHeader} is not valid with ${expectedSignedHeader}${payload}${sig.timestamp}. Please make sure you are passing the payload and header recieved from Zegal`;
    }
    // now verify with timestamp: note that hmac is a hash not a cipher, so we need to send timestamp in the header string too to check
    if (!utils.isValidTime(utils.parseSignHeader(sigHeader, "t"))) {
      throw "The validation time has been expired";
    }
    return true;
  } catch (e) {
    throw new Error(`${e}. Provided payload: ${payload}, header: ${sigHeader}`);
  }
};

module.exports = { verifyWebhookEvent };
