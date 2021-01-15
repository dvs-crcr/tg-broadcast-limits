# tg-broadcast-limits
[![NPM Version][npm-image]][npm-url]
>Node.js module that helps sending Telegram bulk messages without hitting limits and 429 errors.

## Install
```bash
$ npm i @crcr/tg-broadcast-limits
```

## Usage
>See the [examples/](https://github.com/dvs-crcr/tg-broadcast-limits/tree/main/examples) folder for detailed example.
```js
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
```

## Telegram Broadcast limits
Used limit values:
* 20 msg per minute in same group;
* 1 msg per second in same chat;
* 30 msg per second in any chat.
>You can read about the limits on the official [Telegram website](https://core.telegram.org/bots/faq#broadcasting-to-users).

## License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@crcr/tg-broadcast-limits?style=flat-square
[npm-url]: https://www.npmjs.com/package/@crcr/tg-broadcast-limits