const axios = require("axios")

const BASE_URL = "https://asia-northeast1-line-bot-spotify-thirty-sec.cloudfunctions.net/"

exports.getPreviewURL = async function(trackID) {
    const url = await axios.get(BASE_URL + "thirtySecondsURL/" + trackID)
    return url
}
