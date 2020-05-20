import { Context } from 'aws-lambda'
import {
	getFlexportSettings,
	FlexportSettings,
} from '../../settings/getFlexportSettings'
import { SSM } from 'aws-sdk'
import { GQLError } from '../GQLError'
import { Either, isLeft } from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { ErrorInfo } from '../../errors/ErrorInfo'
import {
	v2Client,
	paginate,
	Type,
	liftShipmentLeg,
} from '@distributeaid/flexport-sdk'
import { pipe } from 'fp-ts/lib/pipeable'
import { unwrap } from '../unwrap'

const fetchSettings = getFlexportSettings({
	ssm: new SSM(),
	scopePrefix: process.env.STACK_NAME as string,
})
let flexportSettings: Promise<Either<ErrorInfo, FlexportSettings>>

export const handler = async (
	event: {
		source: {
			legs?: string
		}
	},
	context: Context,
) => {
	console.log(JSON.stringify({ event }))

	if (!flexportSettings) {
		flexportSettings = fetchSettings()
	}
	const maybeSettings = await flexportSettings
	if (isLeft(maybeSettings)) return GQLError(context, maybeSettings.left)

	if (!event.source.legs) return []
	const client = v2Client({ apiKey: maybeSettings.right.apiKey })

	return unwrap(context)(
		pipe(
			client.resolveCollection(liftShipmentLeg)({
				link: event.source.legs,
				refType: Type.ShipmentLeg,
			}),
			TE.chain(paginate(client.resolvePage(liftShipmentLeg))),
		),
	)
}
