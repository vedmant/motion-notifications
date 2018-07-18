require('dotenv').config({ path: __dirname + '/.env' })
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN)

bot.sendPhoto(process.env.TELEGRAM_CHAT_ID, process.argv[2], { caption: 'Motion detected' })
