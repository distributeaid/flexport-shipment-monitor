import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb-v2-node'
import { storeWebhookEvent } from '../storeWebhookEvent'
import { pipe } from 'fp-ts/lib/pipeable'
import { WebhookEvent } from '@distributeaid/flexport-sdk'
import { Either, isLeft } from 'fp-ts/lib/Either'
import { SSM } from 'aws-sdk'
import { ErrorInfo } from '../../errors/ErrorInfo'
import {
	getFlexportSettings,
	FlexportSettings,
} from '../../settings/getFlexportSettings'

const ssm = new SSM()
const scopePrefix = process.env.STACK_NAME as string

const flexportSettingsFetcher = getFlexportSettings({
	ssm,
	scopePrefix,
})
let settings: Promise<Either<ErrorInfo, FlexportSettings>>

const dynamodb = new DynamoDBClient({})

const persist = storeWebhookEvent({
	dynamodb,
	TableName: process.env.SHIPMENT_EVENTS_TABLE ?? '',
})

const headers = {
	'Content-Type': 'application/json; charset=utf-8',
}

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(JSON.stringify({ event }))
	if (event.body === null)
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Must provide event payload' }),
			headers,
		}

	if (settings === undefined) {
		settings = pipe(flexportSettingsFetcher)()
	}
	const maybeSettings = await settings
	if (isLeft(maybeSettings)) {
		console.error(JSON.stringify(maybeSettings.left))
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to fetch settings.' }),
			headers,
		}
	}

	if (
		event.headers['x-hub-signature'] !==
		maybeSettings.right.incomingWebhookSignature
	) {
		console.debug({
			error: `Signature "${event.headers['x-hub-signature']}" does not match expected value "${maybeSettings.right.incomingWebhookSignature}"`,
		})
		return {
			statusCode: 403,
			body: JSON.stringify({
				error: `Signature "${
					event.headers['x-hub-signature']
				}" does not match expected value "${maybeSettings.right.incomingWebhookSignature.substr(
					0,
					3,
				)}***"`,
			}),
			headers,
		}
	}

	let e: WebhookEvent
	try {
		e = JSON.parse(event.body)
		console.log(JSON.stringify({ event: e }))
	} catch (err) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: `Invalid JSON provided: ${err.message}` }),
			headers,
		}
	}

	await pipe(persist(e))()

	return {
		statusCode: 202,
		body: '',
		headers,
	}
}
