const TelegramBotApi = require('node-telegram-bot-api');
const fs = require('fs');
const {makeMp3FileFromLink} = require('./helpers/video-to-mp3')
require('dotenv').config();
process.env["NTBA_FIX_350"] = 1;
const token = process.env.TOKEN;

const bot = new TelegramBotApi(token, {polling: true});

bot.on('message', async(msg) => {
    const {chat, text} = msg;
    const chatId = chat.id;
    console.log(`${chatId} ${chat.username} ${text}`);

    try {
        if(text === '/start') {
            return await bot.sendMessage(chatId, 'Введите ссылку на youtube видео')
        }

        if(text === 'михалыч' || text === 'Михалыч') {
            return await bot.sendSticker(chatId, 'CAACAgIAAxkBAAM5Yt13tV9phKwLIvvLDixRQ5TcC1EAAkMAA_cxZgduu6HMBKBCbCkE');
        }
        
        const progressCallback = async(message) => await bot.sendMessage(chatId, message);
        const errorCallback = async(message) => await bot.sendMessage(chatId, message);
        const successCallback = async (path) => {
            await bot.sendAudio(chatId, path);
            fs.rmSync(path, {
                force: true,
            });
            return;
        };
        return await makeMp3FileFromLink(text, successCallback, errorCallback, progressCallback)
    } catch(e) {
        return bot.sendMessage(chatId, 'Error')
    }
})
