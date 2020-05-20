import {
	DynamoDBClient,
	PutItemCommand,
	PutItemInput,
} from '@aws-sdk/client-dynamodb-v2-node'
import * as TE from 'fp-ts/lib/TaskEither'
import { ErrorInfo, ErrorType } from '../errors/ErrorInfo'
import { WebhookEvent } from '@distributeaid/flexport-sdk'

export const storeWebhookEvent = ({
	dynamodb,
	TableName,
}: {
	dynamodb: DynamoDBClient
	TableName: string
}) => ({
	id,
	type,
	created_at,
	occurred_at,
	data,
}: WebhookEvent): TE.TaskEither<ErrorInfo, boolean> =>
	TE.tryCatch<ErrorInfo, boolean>(
		async () => {
			const query: PutItemInput = {
				TableName,
				Item: {
					id: {
						N: `${id}`,
					},
					occurred_at: {
						S: occurred_at || created_at,
					},
					created_at: {
						S: created_at,
					},
					type: {
						S: type,
					},
					data: {
						S: JSON.stringify(data),
					},
				},
			}
			const res = await dynamodb.send(new PutItemCommand(query))
			console.log(JSON.stringify({ query, res }))
			return true
		},
		(err) => {
			console.error(
				JSON.stringify({
					createSubscription: { error: (err as Error).message, TableName },
				}),
			)
			return {
				type: ErrorType.InternalError,
				message: (err as Error).message,
			}
		},
	)
