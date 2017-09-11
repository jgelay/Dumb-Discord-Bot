var request = require("request-promise");

const client_id = <REDACTED>;
const client_secret = <REDACTED>;
var token;

module.exports = {
  spotifyAuth: function (){
    const authOptions = {
      method: "POST",
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    request(authOptions)
    .then((response) => {
      console.log("Access token: " + response.access_token);
      console.log("Token type: " + response.token_type);
      token = response.access_token;
    })
    .catch((error) => {
      console.log(error);
      console.log("Could not access Spotify Web API");
    })
  },
  search: function (searchKeyWords, callback) {
    console.log("Current token: " + token);
    const searchOptions = {
      method: "GET",
      url: 'https://api.spotify.com/v1/search?q=' + `${escape(searchKeyWords)}&type=track`,
      headers: {
        'Authorization' : 'Bearer ' + token
      },
      json: true
    };
    request(searchOptions)
    .then((response) => {
      console.log(response.tracks.items[0].id);
      callback(response.tracks.items[0].external_urls.spotify);
    })
    .catch((error) =>{
      console.log(error);
    })
  }
}
