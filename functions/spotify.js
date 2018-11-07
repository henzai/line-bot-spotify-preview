const SpotifyWebApi = require('spotify-web-api-node')

exports.newSpotifyClient = async function(){
    const spotifyApi = new SpotifyWebApi({
        clientId: 'ec2c03f5d90d4509abc127fd2548e409',
        clientSecret: 'bdacdf4c2fec489fafd4d900ba498615'
      })
      const token = await spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(token.body['access_token'])
      return spotifyApi
}