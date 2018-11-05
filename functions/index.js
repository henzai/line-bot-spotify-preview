const functions = require('firebase-functions')
const axios = require("axios")
const line = require('@line/bot-sdk')
const crypto = require('crypto')
const SpotifyWebApi = require('spotify-web-api-node')

const BASE_URL = "https://asia-northeast1-line-bot-spotify-thirty-sec.cloudfunctions.net/"

// Line の環境変数
const CHANNEL_ACCESS_TOKEN = functions.config().line.bot.spotify.thirty.sec.access.token
const CHANNEL_SECRET = functions.config().line.bot.spotify.thirty.sec.channel.secret

const SPOTIFY_CLIENT_ID = 'a'
const SPOTIFY_CLIENT_SECRET = 'b' 

// trackURIを引数にして、30秒試聴URLを返す.
exports.thirtySecondsURL = functions
    .region('asia-northeast1')
    .https.onRequest(async(request, response) => {
        // パラメータ取得
        console.log(request.params)
        let param = request.params[0].slice(1)

        const trackId = param
        const spotifyApi = await newSpotifyClient()
        const data = await spotifyApi.getTracks(new Array(trackId))
        console.log(data.body.tracks)
    
        response.status(200).send(data.body.tracks[0].preview_url)
});

async function newSpotifyClient(){
    const spotifyApi = new SpotifyWebApi({
        clientId: 'ec2c03f5d90d4509abc127fd2548e409',
        clientSecret: 'bdacdf4c2fec489fafd4d900ba498615'
      })
      const token = await spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(token.body['access_token'])
      return spotifyApi
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
    .https.onRequest(async (request, response) => {

        // 署名の検証
        if (!validateSignature(request)){
            console.error("invalid signature")
            response.send(200)
            return
        }
        // テキストだったら

        // 規定のBaseURLだったら

        const url = await axios.get(BASE_URL +"thirtySecondsURL/6Dwtha2FtZFoMEBh5GR2sq")
            .catch((err) => {
                console.error(err)
            })
        console.log(url)
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
                text: url.data,
            })
        }

        response.send(200)
});
