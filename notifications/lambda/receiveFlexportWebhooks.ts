import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb-v2-node'
import { storeWebhookEvent } from '../storeWebhookEvent'
import { pipe } from 'fp-ts/lib/pipeable'
import { WebhookEvent } from '@distributeaid/flexport-sdk'

const dynamodb = new DynamoDBClient({})

const persist = storeWebhookEvent({
	dynamodb,
	TableName: process.env.SHIPMENT_EVENTS_TABLE || '',
})

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	if (!event.body)
		return { statusCode: 400, body: 'Must provide event payload' }
	let e: WebhookEvent
	try {
		e = JSON.parse(event.body)
		console.log(JSON.stringify({ event: e }))
	} catch (err) {
		return { statusCode: 400, body: `Invalid JSON provided: ${err.message}` }
	}

	await pipe(persist(e))()

	return { statusCode: 202, body: '' }
}
