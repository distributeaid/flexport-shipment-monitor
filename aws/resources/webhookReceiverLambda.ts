import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import { SQS } from 'aws-sdk'

const sqs = new SQS()
const QueueUrl = process.env.SQS_QUEUE ?? ''

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	const args = {
		MessageBody: event.body ?? '',
		QueueUrl,
		MessageGroupId: event.path.substr(1),
		MessageDeduplicationId: event.requestContext.requestId,
	}

	await sqs.sendMessage(args).promise()

	console.log(JSON.stringify(args))

	return {
		statusCode: 202,
		body: '',
	}
}
