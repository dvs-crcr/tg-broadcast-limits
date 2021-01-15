const TelegramApi = require('./TelegramApi'); // telegram api example
const TBL = require('@crcr/tg-broadcast-limits').default;
// OR USE: 
// import { default as TBL } from '@crcr/tg-broadcast-limits'

const chatIds = [1, 2, 3];  // Array of chat ids ;)
const token = '123:heLLoworldtGBRoadCaStLimiTS'; // Telegram bot api token

function broadcast(token, chatIds, text) {
  const tbl = new TBL()
  chatIds.forEach((chatId) => {
    tbl.push(chatId, TelegramApi.sendMessage.bind(this), token, chatId, text);
  })
}

broadcast(token, chatIds, 'Hello from dvs!');