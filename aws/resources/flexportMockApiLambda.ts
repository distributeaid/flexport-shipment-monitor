import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import {
	handlePath,
	badTokenResponse,
} from '@distributeaid/flexport-api-sandbox'

const apiKey = process.env.API_KEY ?? 'apiKey'

const toQueryString = (params: { [key: string]: any } | null): string => {
	if (params === null) return ''
	return `?${Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&')}`
}

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log(JSON.stringify({ event, apiKey }))
	if (event.headers.Authorization !== `Bearer ${apiKey}`)
		return badTokenResponse()
	return handlePath(
		`https://${event.requestContext.domainName}/${event.requestContext.stage}`,
	)(`${event.path}${toQueryString(event.queryStringParameters)}`)
}
