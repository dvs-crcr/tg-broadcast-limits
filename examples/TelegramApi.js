// Telegram API example
const https = require('https');

class TelegramApi {

  static api(token, method, params = {}) {
    return new Promise((resolve) => {
      let req = https.request({
        host: 'api.telegram.org',
        port: 443,
        path: '/bot'+encodeURIComponent(token)+'/'+encodeURIComponent(method),
        method: 'POST',
        agent: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(params))
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk.toString();
        }); 
        res.on('end', () => resolve(JSON.parse(data)));
      })
      req.write(JSON.stringify(params))
      req.end()
    })
  }

	static sendMessage(token, chatId, text, parse_mode = 'HTML', disablePreview = true) {
		return new Promise((resolve) => {
			let obj = {
				chat_id: chatId,
				text: text,
				parse_mode: parse_mode,
				disable_web_page_preview: disablePreview
      };
			return TelegramApi.api(token, 'sendMessage', obj).then(data => {
        resolve(data)
      });
		})
  }

}

module.exports = TelegramApi;