const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const ytdl = require('ytdl-core');

function validateUrl(value)
{
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    var regexp = new RegExp(expression);
    return regexp.test(value);
} 


const makeMakeMp3FileFromLink = async(url, successCallback, errorCallback) => {
    if(!validateUrl(url)) {
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
        "ffmpegPath": "C:\\Users\\Tenebris\\Documents\\FFMPEG\\bin\\ffmpeg.exe",
        "outputPath": "./",
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000,
        "allowWebm": false
    });
    
    YD.download(videoId);
    
    YD.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
        successCallback(data.file);
        return true;
    });
    
    YD.on("error", function(error) {
        errorCallback('Unknown error');
        errorCallback();
    });
    
    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress));
    });
}

module.exports = {makeMakeMp3FileFromLink}