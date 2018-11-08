const functions = require("firebase-functions");
const SpotifyWebApi = require("spotify-web-api-node");

exports.newSpotifyClient = async function(clientID, clientSecret) {
  const spotifyApi = new SpotifyWebApi({
    clientId: clientID,
    clientSecret: clientSecret
  });
  const token = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(token.body["access_token"]);
  return spotifyApi;
};
