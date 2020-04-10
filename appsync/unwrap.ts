import { Context } from 'aws-lambda'
import { isLeft, Either } from 'fp-ts/lib/Either'
import { ErrorInfo } from './ErrorInfo'
import { GQLError, GQLErrorResult } from './GQLError'

export const unwrap = (context: Context) => async (
	e: () => Promise<Either<ErrorInfo, unknown>>,
): Promise<GQLErrorResult | unknown> => {
	const r = await e()
	if (isLeft(r)) {
		return GQLError(context, r.left)
	}
	console.debug(JSON.stringify(r.right))
	return r.right
}
