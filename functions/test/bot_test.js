const test = require("ava");
const bot = require("../bot.js");
const url = require("url");

test(t => {
  const parser = new URL(
    "https://open.spotify.com/track/6Dwtha2FtZFoMEBh5GR2sq"
  );
  const actual = parser.pathname.split("/").pop();
  const host = parser.origin;
  t.is(actual, "6Dwtha2FtZFoMEBh5GR2sq");
  t.is(host, "https://open.spotify.com");
});

test(t => {
  const actual = bot.extractTrackID(
    "https://open.spotify.com/track/6Dwtha2FtZFoMEBh5GR2sq"
  );
  t.is(actual, "6Dwtha2FtZFoMEBh5GR2sq");
});

test(t => {
  const actual = bot.extractTrackID(
    "https://open.spotify.com/track/3YcQMEQsLWiya2zjSKKJAU?si=3UiltihmTv2PCsj3V2FY1w"
  );
  t.is(actual, "3YcQMEQsLWiya2zjSKKJAU");
});
