import { SSM } from 'aws-sdk'
import { getSettings } from './getSettings'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { unwrapOptionalKeys } from './unwrapOptionalKeys'

export type FlexportSettings = {
	apiKey: string
	endpoint?: string
	incomingWebhookSignature: string
}

export const getFlexportSettings = ({
	ssm,
	scopePrefix,
}: {
	ssm: SSM
	scopePrefix: string
}) =>
	pipe(
		getSettings({ ssm, scope: `${scopePrefix}/flexport` }),
		TE.map((f) => ({
			apiKey: f('apiKey'),
			endpoint: f('endpoint'),
			incomingWebhookSignature: f('incomingWebhookSignature'),
		})),
		TE.map((cfg) => unwrapOptionalKeys<FlexportSettings>(cfg)),
	)
