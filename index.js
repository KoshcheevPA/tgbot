const fs = require('fs');
const TelegramBotApi = require('node-telegram-bot-api');
const {makeMakeMp3FileFromLink} = require('./helpers/video-to-mp3')
require('dotenv').config();
const token = process.env.TOKEN;

const bot = new TelegramBotApi(token, {polling: true});

bot.on('message', async(msg) => {
    const {chat, text} = msg;
    const chatId = chat.id;
    console.log(msg);

    try {
        if(text === '/start') {
            return await bot.sendMessage(chatId, 'Введите ссылку на youtube видео')
        }

        if(text === 'михалыч' || text === 'Михалыч') {
            return await bot.sendSticker(chatId, 'CAACAgIAAxkBAAM5Yt13tV9phKwLIvvLDixRQ5TcC1EAAkMAA_cxZgduu6HMBKBCbCkE');
        }

        const errorCallback = async(message) => await bot.sendMessage(chatId, message);
        const successCallback = async (path) => {
            await bot.sendAudio(chatId, path);
            fs.rmSync(path, {
                force: true,
            });
            return;
        };
        makeMakeMp3FileFromLink(text, successCallback, errorCallback)
    } catch(e) {
        return bot.sendMessage(chatId, 'Error')
    }
})
