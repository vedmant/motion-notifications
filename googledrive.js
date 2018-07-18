require('dotenv').config({path: __dirname + '/.env'})
const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')
const co = require('co')
const util = require('util')
const readline = require('readline')
const path = require('path')
const { google } = require('googleapis')

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file']
const TOKEN_PATH = __dirname + '/google-token.json'

co(function* () {
  const data = yield util.promisify(fs.readFile)(__dirname + '/credentials.json')
  const auth = yield authorize(JSON.parse(data))
  const drive = google.drive({ version: 'v3', auth })

  if (!process.argv[2]) return
  const { data: files } = yield drive.files.list({ pageSize: 100, fields: 'files(id, name)', q: "mimeType = 'application/vnd.google-apps.folder' AND trashed != true" })

  let folder = files.files.find(file => file.name === 'PiCamera')
  if (!folder) {
    folder = (yield drive.files.create({
      resource: { 'name': 'PiCamera', 'mimeType': 'application/vnd.google-apps.folder' },
      fields: 'id, name',
    })).data
  }

  const { data: file } = yield drive.files.create({
    resource: { 'name': path.basename(process.argv[2]), parents: [folder.id] },
    media: { mimeType: 'video/mp4', body: fs.createReadStream(process.argv[2]) },
    fields: 'id, name, webViewLink, webContentLink'
  })

  console.log('Video file uploaded')

  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN)
  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `View video: ${file.webViewLink}`)
}).catch(err => {
	console.error(err)
})

/**
 * Create an OAuth2 client with the given credentials
 *
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
  return new Promise((resolve, reject) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client).then(resolve)
      oAuth2Client.setCredentials(JSON.parse(token))
      resolve(oAuth2Client)
    })
  })
}

/**
 * Get and store new token after prompting for user authorization
 *
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err)
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err)
          console.log('Token stored to', TOKEN_PATH)
        })
        resolve(oAuth2Client)
      })
    })
  })
}
