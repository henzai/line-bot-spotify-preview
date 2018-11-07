const functions = require('firebase-functions')
const SpotifyWebApi = require('spotify-web-api-node')

exports.newSpotifyClient = async function(){
    const spotifyApi = new SpotifyWebApi({
        clientId: functions.config().spotify.client.id,
        clientSecret: functions.config().spotify.client.secret
      })
      const token = await spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(token.body['access_token'])
      return spotifyApi
}