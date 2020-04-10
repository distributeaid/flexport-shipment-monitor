import { Context } from 'aws-lambda'
import { getFlexportSettings, FlexportSettings } from '../getFlexportSettings'
import { SSM } from 'aws-sdk'
import { GQLError } from '../GQLError'
import { Either, isLeft } from 'fp-ts/lib/Either'
import { ErrorInfo, ErrorType } from '../ErrorInfo'
import { pipe } from 'fp-ts/lib/pipeable'
import { createClient } from '@distributeaid/flexport-sdk'

const fetchSettings = getFlexportSettings({
	ssm: new SSM(),
	scopePrefix: process.env.STACK_NAME as string,
})
let flexportSettings: Promise<Either<ErrorInfo, FlexportSettings>>

export const handler = async (event: {}, context: Context) => {
	console.log(JSON.stringify({ event }))

	if (!flexportSettings) {
		flexportSettings = fetchSettings()
	}
	const maybeSettings = await flexportSettings
	if (isLeft(maybeSettings)) return GQLError(context, maybeSettings.left)

	const { apiKey } = maybeSettings.right

	const client = createClient({ apiKey })

	const shipments = await pipe(client.listAllShipments())()

	if (isLeft(shipments)) {
		return GQLError(context, {
			message: shipments.left.message,
			type: ErrorType.BadGateway,
		})
	}

	console.log(JSON.stringify({ shipments: shipments.right }))

	return shipments.right
}
