const Discord = require("discord.js");
const youtube = require("./youtube");
const spotify = require("./spotify");
const ytdl = require("ytdl-core");
const client = new Discord.Client();

client.login(<REDACTED>);

client.on("ready", () => {
  console.log("I am ready!");
  spotify.spotifyAuth();
});

client.on("message", (message) => {

  let prefix = "!";

  if (!message.content.startsWith(prefix)) return;

  if (message.content.startsWith(prefix + "yt")){

    var searchTerm = message.content.split(/\s+/g).splice(1,message.content.length).join(" ");
    youtube.youtubeSearch(searchTerm, (vidLink) => {
      message.channel.send("https://www.youtube.com/watch?v=" + vidLink);
    });
  }

  if (message.content.startsWith(prefix + "play")){

    const streamOptions = { seek: 0, volume: 1};
    var searchTerm = message.content.split(/\s+/g).splice(1,message.content.length).join(" ");
    youtube.youtubeSearch(searchTerm, (vidLink) => {
      var vidURL = "https://www.youtube.com/watch?v=" + vidLink;

      var stream = ytdl(vidURL, {filter: 'audioonly'});
      if (message.guild.channels.find("name","Karaoke") === null) {
        message.guild.createChannel("Karaoke","voice")
          .then((channel) => {
            console.log(channel + " has been created.")

            channel.join()
              .then((connection) => {
                connection.playStream(stream,streamOptions);
              })

          })
          .catch(console.error);
      } else {
        var channel = message.guild.channels.find("name","Karaoke");
        channel.join()
          .then((connection) => {
            connection.playStream(stream,streamOptions);
          })
      }
    });


  }

  if (message.content.startsWith(prefix + "kick")){
    var member = message.mentions.members.first();

    if (message.member.roles.find("name","Administrator")){
      member.kick()
        .then((member) => {
          message.channel.send(":wave: " + member.displayName + " has been kicked.")
        })
        .catch(console.error);
    }
    else {
      message.channel.send(":raised_hand: " + "only Administrators can kick other members." )
    }

  }
  if (message.content.startsWith(prefix + "help")){
    message.channel.send("!kick @<username> : kicks mentioned user.");
    message.channel.send("!yt <search term> : searches youtube for term and links first video in the list.");
    message.channel.send("!play <search term> : searches youtube for term and plays the audio in the karaoke channel (WIP)");
  }



});
