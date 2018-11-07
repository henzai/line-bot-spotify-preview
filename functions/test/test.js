const test = require('ava')
const index = require('../spotify.js')

test(t => {
    const actual = index.getPreviewURL("https://open.spotify.com/track/6Dwtha2FtZFoMEBh5GR2sq")
    t.is(actual, "6Dwtha2FtZFoMEBh5GR2sq")
  })