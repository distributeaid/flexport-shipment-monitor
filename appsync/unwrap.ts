import { Context } from 'aws-lambda'
import { isLeft, Either } from 'fp-ts/lib/Either'
import { GQLError, GQLErrorResult, toErrorInfo } from './GQLError'
import { ErrorInfo } from '@distributeaid/flexport-sdk'

export const unwrap = (context: Context) => async (
	e: () => Promise<Either<ErrorInfo, unknown>>,
): Promise<GQLErrorResult | unknown> => {
	const r = await e()
	if (isLeft(r)) {
		return GQLError(context, toErrorInfo(r.left))
	}
	console.debug(JSON.stringify(r.right))
	return r.right
}
