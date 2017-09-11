const API_KEY = <REDACTED>;
var request = require("request-promise");
var ytdl = require("ytdl-core");
var fs = require("fs");

module.exports = {
  youtubeSearch: function (searchKeywords, callback){

    const options = {
      method: "GET",
      uri: 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(searchKeywords)}&key=${API_KEY}`,
      json: true
    };

    request(options)
      .then(function (response){
        console.log(response.items[0].id.videoId);
        callback(response.items[0].id.videoId);
      })
      .catch((error) => {
        console.log(error);
      })
  }
}
