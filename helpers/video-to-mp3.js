const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ytdl = require('ytdl-core');

const makeMp3FileFromLink = async(url, successCallback, errorCallback, progressCallback) => {
    if(!ytdl.validateURL(url)) {
        errorCallback('Невалидный URL');
        return;
    };

    let info;
    try {
      info = await ytdl.getInfo(url, { quality: this.youtubeVideoQuality })
    } catch (err){
      errorCallback('Unknown Error');
      console.log(err)
      return;
    }

    if(info.videoDetails.lengthSeconds > 3600) {
        errorCallback('Длительность видео первышает один час, многовато...');
        return;
    }

    const youtubeUrl = new URL(url);

    const videoId = new URLSearchParams(youtubeUrl.search).get('v');
    if(!videoId) {
        errorCallback('Невалидный URL');
        return;
    };
    
    const YD = new YoutubeMp3Downloader({
        "outputPath": "./",
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000,
        "allowWebm": false
    });
    
    YD.download(videoId);
    
    YD.on("finished", function(err, data) {
        successCallback(data.file);
        return true;
    });
    
    YD.on("error", function(error) {
        console.log(error)
        errorCallback('Unknown error');
    });
}

module.exports = {makeMp3FileFromLink}