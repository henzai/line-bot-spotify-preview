const crypto = require("crypto");
const line = require("@line/bot-sdk");

// Signatureの検証
exports.validateSignature = function(request) {
  const actual = request.headers["x-line-signature"];

  const bodyString = JSON.stringify(request.body);
  const expected = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(bodyString)
    .digest("base64");

  return expected === actual;
};

exports.extractTrackID = function(text) {
  const SPOTIFY_BASE_URL = "https://open.spotify.com";

  const parser = new URL(text);
  if (parser.origin !== SPOTIFY_BASE_URL) {
    return null;
  }
  const id = parser.pathname.split("/").pop();
  return id;
};

exports.newLineClient = function(token, secret) {
  const config = {
    channelAccessToken: token,
    channelSecret: secret
  };
  return new line.Client(config);
};
