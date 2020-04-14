const crypto = require("crypto");
const { addTimestampToPayload, formatHeader } = require("./utils");
/**
 * Returns hmac (buffer or string) signature with payload and timestamp against given secret
 * @param {String} data stringified payload
 * @param {String} secret secret key
 */
const generateHash = (data, secret) => {
  return crypto.createHmac("sha256", secret).update(data, "utf8").digest("hex");
};

/**
 * Generate signed hash for given payload and secret
 * @param {String} payloadString
 * @param {String} secret
 * @param {Number} timestamp
 */
const generateSignedHeader = (payloadString, secret, timestamp) => {
  // add this timestamp to generate the secret to prevent replay attack
  const data = addTimestampToPayload(timestamp, payloadString);
  const hashSignature = generateHash(data, secret);
  return formatHeader(timestamp, hashSignature);
};

/**
 * Compare the given with expected hash to verify webhook call
 * @param {String} given hash from header
 * @param {String} expected hash expected for the provided payload
 */
const compareSignature = (given, expected) => {
  // timingSafeEqual needs buffer
  given = Buffer.from(given, "utf-8");
  expected = Buffer.from(expected, "utf-8");
  if (given.length !== expected.length) return false;
  //timingSafeEqual is suitable for comparing HMAC digests or secret values >> returns boolean
  return crypto.timingSafeEqual(given, expected);
};

module.exports = {
  generateSignedHeader,
  compareSignature,
};
