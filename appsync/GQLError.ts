import { Context } from 'aws-lambda'
import { ErrorInfo, ErrorType } from './ErrorInfo'
import { ApiError } from '@distributeaid/flexport-sdk'

export type GQLErrorResult = {
	errorType: ErrorType
	errorMessage: string
	data: object
	errorInfo: {
		AWSrequestID: string
	}
}

/**
 * See $util.error(String, String, Object, Object)
 in https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference.html#utility-helpers-in-util
 */
export const GQLError = (
	context: Context,
	error: ErrorInfo,
): GQLErrorResult => {
	console.error(
		JSON.stringify({
			context,
			error,
		}),
	)
	return {
		errorType: error.type,
		errorMessage: error.message,
		data: {},
		errorInfo: {
			AWSrequestID: context.awsRequestId,
		},
	}
}

export const toErrorInfo = (error: ApiError): ErrorInfo => ({
	type: ErrorType.BadGateway,
	message: `${error.message} (${error.code})`,
})
