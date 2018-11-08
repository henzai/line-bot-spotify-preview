const functions = require("firebase-functions");
const spotify = require("./spotify");
const api = require("./api");
const bot = require("./bot");

// Line の環境変数
const CHANNEL_ACCESS_TOKEN = functions.config().line.bot.spotify.thirty.sec
  .access.token;
const CHANNEL_SECRET = functions.config().line.bot.spotify.thirty.sec.channel
  .secret;

// Spotify の環境変数
const SPOTIFY_CLIENT_ID = functions.config().spotify.client.id;
const SPOTIFY_CLIENT_SECRET = functions.config().spotify.client.secret;

// trackURIを引数にして、30秒試聴URLを返す.
exports.thirtySecondsURL = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    // パラメータ取得
    console.log(request.params);
    let param = request.params[0].slice(1);

    const trackId = param;
    const spotifyApi = await spotify.newSpotifyClient(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET
    );
    const data = await spotifyApi.getTracks(new Array(trackId));
    console.log(data.body.tracks);

    response.status(200).send(data.body.tracks[0].preview_url);
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    // 署名の検証
    if (!bot.validateSignature(request)) {
      console.error("invalid signature");
      response.send(200);
      return;
    }

    // リクエストのログ
    console.log(request.body.events);
    const events = request.body.events;

    await Promise.all(events.map(parallel));

    response.send(200);
  });

async function parallel(event) {
  console.log(event.source);
  console.log(event.message);
  console.log(event.replyToken);

  // メッセージ以外のイベントは弾く
  if (event.type !== "message") {
    response.send(200);
    return;
  }
  // リクエストのメッセージからトラックIDを抽出
  const trackID = bot.extractTrackID(event.message.text);
  if (trackID === null) {
    response.send(200);
    return;
  }

  // プレビュー用URLを得る
  const previewURL = await api.getPreviewURL(trackID).catch(err => {
    console.error(err);
  });

  // リプライ
  const lineClient = bot.newLineClient(CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET);
  lineClient.replyMessage(event.replyToken, {
    type: "text",
    text: previewURL.data
  });
}
