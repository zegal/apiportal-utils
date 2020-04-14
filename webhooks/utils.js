const EXPIRY = 15 * 60; // 15 min for our service

/**
 * Generate timestamp in seconds
 */
const getTimestamp = () => Math.floor(Date.now() / 1000);

/**
 * Check if the data is a valid JSON object or not
 * @param {*} data expects Object
 */
function isJsonValid(data) {
  // assumption: we get stringified payload as content type sent is `application/json`
  // if JSON.parse runs, then the data is already stringified
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Add timestamp in signature
 * @param {Number} timestamp
 * @param {String | Buffer} signature
 */
const addTimestampToPayload = (timestamp, payload) => `${timestamp},${payload}`;

/**
 * Format header in form `t=<timestamp,h=<hash`
 * @param {Number} timestamp
 * @param {String} signature
 */
const formatHeader = (timestamp, signature) => `t=${timestamp},h=${signature}`;

/**
 *
 * @param {Number} timestamp given timestamp to check in sec
 * @param {Number} expiry expiry in sec
 */
const isValidTime = (timestamp, expiry = EXPIRY) => {
  const stampWindow = getTimestamp() - expiry;
  return stampWindow < timestamp;
};

/**
 * Parse header to get timestamp or hash key
 * @param {String} header provided header in callback url in the form `t=<timestamp>,h=<hash>`
 * @param {String} key header key (`t` for timestamp and `h` for hash)
 */
const parseSignHeader = (header, key) => {
  const data = header.split(",");
  for (let i = 0; i < data.length; i++) {
    const pair = data[i].split("=");
    if (pair[0] === key) {
      return pair[1];
    }
  }
};

module.exports = {
  addTimestampToPayload,
  formatHeader,
  isJsonValid,
  isValidTime,
  parseSignHeader,
};
