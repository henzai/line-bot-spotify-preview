const crypto = require("crypto");
const line = require("@line/bot-sdk");
const { URL } = require("url");

// Signatureを検証する
exports.validateSignature = function(request, channelSecret) {
  const actual = request.headers["x-line-signature"];

  const bodyString = JSON.stringify(request.body);
  const expected = crypto
    .createHmac("SHA256", channelSecret)
    .update(bodyString)
    .digest("base64");

  return expected === actual;
};

// URLからトラックIDを得る
exports.extractTrackID = function(text) {
  const SPOTIFY_BASE_URL = "https://open.spotify.com";

  const parser = new URL(text);
  if (parser.origin !== SPOTIFY_BASE_URL) {
    return null;
  }
  const id = parser.pathname.split("/").pop();
  return id;
};

// 新しいLINEのクライアントを得る
exports.newLineClient = function(token, secret) {
  const config = {
    channelAccessToken: token,
    channelSecret: secret
  };
  return new line.Client(config);
};
