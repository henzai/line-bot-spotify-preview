const functions = require('firebase-functions')
const line = require('@line/bot-sdk')
const crypto = require('crypto')
const SpotifyWebApi = require('spotify-web-api-node');

// Line の環境変数
const CHANNEL_ACCESS_TOKEN = functions.config().line.bot.spotify.thirty.sec.access.token
const CHANNEL_SECRET = functions.config().line.bot.spotify.thirty.sec.channel.secret

// trackURIを引数にして、30秒試聴URLを返す.
function getThirtySecondsURL(trackURI) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.getTracks(trackId)
    .then((data) => {
        return data
    }).catch( (err) => {
        console.error(err)
    })
}

// Signatureの検証
function validateSignature(request) {
    const actual = request.headers['x-line-signature']

    const bodyString = JSON.stringify(request.body)
    const expected = crypto
        .createHmac('SHA256', CHANNEL_SECRET)
        .update(bodyString).digest('base64')

    return expected === actual
}

function newLineClient(){
    const config = {
        channelAccessToken: CHANNEL_ACCESS_TOKEN,
        channelSecret: CHANNEL_SECRET,
    }
    return new line.Client(config)
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions
    .region('asia-northeast1')
    .https.onRequest((request, response) => {

        // 署名の検証
        if (!validateSignature(request)){
            console.error("invalid signature")
            response.send(200)
            return
        }
        // テキストだったら

        // 規定のBaseURLだったら

        // リクエストのログ
        console.log(request.body.events)
        const events = request.body.events
        for (let i of events) {
            console.log(i.source)
            console.log(i.message)
            console.log(i.replyToken)
    
            const lineClient = newLineClient()
            lineClient.replyMessage(i.replyToken, {
                type: "text",
                text: i.message.text,
            })
        }

        response.send(200)
});
