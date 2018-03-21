'use strict';

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

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