require('dotenv').config({ path: __dirname + '/.env' })
const PushBullet = require('pushbullet')
const pusher = new PushBullet(process.env.PUSHBULLET_TOKEN)

pusher.file({}, process.argv[2], 'Motion Detected')
