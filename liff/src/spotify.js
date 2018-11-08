import SpotifyWebApi from "spotify-web-api-node";
import { get } from "axios";

export async function newSpotifyClient() {
  const token = getClient();
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(token);
  return spotifyApi;
}

const BASE_URL =
  "https://asia-northeast1-line-bot-spotify-thirty-sec.cloudfunctions.net/";

async function getClient() {
  const result = await get(BASE_URL + "newSpotifyClient");
  return result.data.token.body["access_token"];
}
