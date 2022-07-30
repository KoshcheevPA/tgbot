const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ytdl = require('ytdl-core');

const makeMp3FileFromLink = async(url, successCallback, sendMessageCallback) => {
    if(!ytdl.validateURL(url)) {
        sendMessageCallback('Невалидный URL');
        return;
    };

    let info;
    let videoId;
    try {
      info = await ytdl.getInfo(url, { quality: this.youtubeVideoQuality })
      videoId = info.videoDetails.videoId;
    } catch (err) {
      sendMessageCallback('Unknown Error');
      console.log(err)
      return;
    }

    if(info.videoDetails.lengthSeconds > 3600) {
        sendMessageCallback('Длительность видео первышает один час, многовато...');
        return;
    }

    if(!videoId) {
        sendMessageCallback('Невалидный URL');
        return;
    };
    
    const YD = new YoutubeMp3Downloader({
        "outputPath": "./",
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000,
        "allowWebm": true
    });
    
    YD.download(videoId);
    
    YD.on("finished", function(err, data) {
        successCallback(data.file);
        return true;
    });
    
    YD.on("error", function(error) {
        console.log(error)
        sendMessageCallback('Unknown error');
    });
}

module.exports = {makeMp3FileFromLink}