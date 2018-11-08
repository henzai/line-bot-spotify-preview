import { get } from "axios";

const BASE_URL =
  "https://asia-northeast1-line-bot-spotify-thirty-sec.cloudfunctions.net/";

export async function getPreviewURL(trackID) {
  const url = await get(BASE_URL + "thirtySecondsURL/" + trackID);
  return url.data;
}
