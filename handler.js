'use strict';

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const accountSid = 'your Sid'
const authToken = 'your token'
const twilio = require('twilio');
const client = new twilio(accountSid, authToken)

module.exports.notify = (event, context, callback) => {
  const name = event['Records'][0]['dynamodb']['NewImage']
  const filename = name.name.S
  const func = name.event.S
  client.messages.create({
      body: `The file ${filename} was ${func} in your S3 bucket.`,
      to: 'your telephone',  
      from: 'your twilio telephone' 
  })
  .then((message) => console.log(message.sid))  
}

module.exports.create = (event, context, callback) => { 
  const bucket = event['Records'][0]['s3']['bucket']['name']
  const filename = event['Records'][0]['s3']['object']['key']
  const ts = event['Records'][0]['eventTime']
  let func
  const timestamp = new Date().getTime()
  if (event['Records'][0]['eventName'] == 'ObjectCreated:Put')
      func = 'created'
  else
      func = 'deleted'
  const obj = {
    TableName: 'controlS3',
    Item: {
      fileId: timestamp.toString(),
      name: filename,
      date: ts,
      event: func
    }  
  }
  dynamoDb.put(obj, (error) =>{
    if(error){
      console.error(error)
      callback(null, { statusCode: 400, body: JSON.stringify(error) })
      return
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(obj.Item)
    }
    callback(null, response)
  })
}