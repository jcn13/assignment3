'use strict'

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const obj = {
	TableName: 'controlS3'
}

module.exports.list = (event, context, callback) => {
	dynamoDb.scan(obj, (error, result) =>{
		if(error){
			console.error(error)
			callback(null, { statusCode: 400, body: JSON.stringify(error) })
			return
		}
		const response = {
			statusCode: 200,
			body: JSON.stringify(result.Items)
		}
		callback(null, response)
	})
}