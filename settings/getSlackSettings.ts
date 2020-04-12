import { SSM } from 'aws-sdk'
import { getSettings } from './getSettings'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { ErrorType } from '../errors/ErrorInfo'
import { isNone } from 'fp-ts/lib/Option'
import { unwrapOptionalKeys } from './unwrapOptionalKeys'

export type SlackSettings = {
	webhook: string
}

export const getSlackSettings = ({
	ssm,
	scopePrefix,
}: {
	ssm: SSM
	scopePrefix: string
}) =>
	pipe(
		getSettings({ ssm, scope: `${scopePrefix}/slack` }),
		TE.map((f) => ({
			webhook: f('webhook'),
		})),
		TE.map((cfg) =>
			Object.values(cfg).filter(isNone).length
				? TE.left({
						type: ErrorType.EntityNotFound,
						message: 'Slack configuration not available!',
				  })
				: TE.right(cfg),
		),
		TE.flatten,
		TE.map((cfg) => unwrapOptionalKeys<SlackSettings>(cfg)),
	)
