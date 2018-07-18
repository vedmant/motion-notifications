# Notifications for motion app for Raspberry PI camera

## Setup

1. Install dependencies `yarn`
2. Copy .env.example to .env and put needed api keys

## Upload video file to S3

Motion config:
on_movie_end node /path/to/motion-notifications/s3.js %f


## Upload video to Google Drive and send Telegram chat bot notification

To acquire Google Drive API keys go to https://console.developers.google.com/
To get TELEGRAM_TOKEN and TELEGRAM_CHAT_ID follow official instructions: https://core.telegram.org/bots

Motion config:
on_movie_end node /path/to/motion-notifications/googledrive.js %f

It will create folder PiCamera on Google Drive and send notification with view link to Telegram


## Send Telegram notification with image

To get TELEGRAM_TOKEN and TELEGRAM_CHAT_ID follow official instructions: https://core.telegram.org/bots

Motion config:
on_picture_save node /path/to/motion-notifications/telegram.js %f


## Send Pushbullet notification with image

Firstly setup Pushbullet account and acquire PUSHBULLET_TOKEN

Motion config:
on_picture_save node /path/to/motion-notifications/pushbullet.js %f
