const functions = require('firebase-functions')
const crypto = require('crypto')
const line = require('@line/bot-sdk')

// Line の環境変数
const CHANNEL_ACCESS_TOKEN = functions.config().line.bot.spotify.thirty.sec.access.token
const CHANNEL_SECRET = functions.config().line.bot.spotify.thirty.sec.channel.secret

// Signatureの検証
exports.validateSignature = function (request) {
    const actual = request.headers['x-line-signature']

    const bodyString = JSON.stringify(request.body)
    const expected = crypto
        .createHmac('SHA256', CHANNEL_SECRET)
        .update(bodyString).digest('base64')

    return expected === actual
}

exports.extractTrackID = function(text) {
    const SPOTIFY_BASE_URL = "https://open.spotify.com/track/"
    if(text.startsWith(SPOTIFY_BASE_URL)){
        const url = text.split("/")[4]
        return url
    } else {
        return ""
    }
};

exports.newLineClient = function(){
    const config = {
        channelAccessToken: CHANNEL_ACCESS_TOKEN,
        channelSecret: CHANNEL_SECRET,
    }
    return new line.Client(config)
}
