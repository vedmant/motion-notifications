require('dotenv').config({ path: __dirname + '/.env' })
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

AWS.config.update({ accessKeyId: process.env.AWS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY })

var fileStream = fs.createReadStream(process.argv[2])
fileStream.on('error', function(err) {
  if (err) throw err
})

fileStream.on('open', function() {
  var s3 = new AWS.S3()
  s3.upload(
    {
      Bucket: 'vedmant-general',
      Key: path.basename(process.argv[2]),
      Body: fileStream,
    },
    function(err) {
      if (err) throw err
      console.log('Uploaded video to S3')
    },
  )
})
