const functions = require('firebase-functions')
const axios = require("axios")
const line = require('@line/bot-sdk')
const crypto = require('crypto')
const SpotifyWebApi = require('spotify-web-api-node')

const BASE_URL = "https://asia-northeast1-line-bot-spotify-thirty-sec.cloudfunctions.net/"

// Line の環境変数
const CHANNEL_ACCESS_TOKEN = functions.config().line.bot.spotify.thirty.sec.access.token
const CHANNEL_SECRET = functions.config().line.bot.spotify.thirty.sec.channel.secret

// trackURIを引数にして、30秒試聴URLを返す.
exports.thirtySecondsURL = functions
    .region('asia-northeast1')
    .https.onRequest(async(request, response) => {
        console.log(request.params)
        let param = request.params[0].slice(1)

        // const spotifyApi = new SpotifyWebApi();
        // spotifyApi.getTracks(trackId)
        // .then((data) => {
        //     return data
        // }).catch( (err) => {
        //     console.error(err)
        // })
    
        response.status(200).send(param)
});

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
    .https.onRequest(async (request, response) => {

        // 署名の検証
        if (!validateSignature(request)){
            console.error("invalid signature")
            response.send(200)
            return
        }
        // テキストだったら

        // 規定のBaseURLだったら
        try{
            const url = await axios.get(BASE_URL +"thirtySecondsURL/6Dwtha2FtZFoMEBh5GR2sq")
            console.log(url.data)
        } catch (err) {
            console.error(err)
        }

        
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
