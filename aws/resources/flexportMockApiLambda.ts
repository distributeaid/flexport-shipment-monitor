import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(JSON.stringify({ event }))

	return { statusCode: 501, body: '' }
}
