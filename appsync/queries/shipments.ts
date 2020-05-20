import { Context } from 'aws-lambda'
import {
	getFlexportSettings,
	FlexportSettings,
} from '../../settings/getFlexportSettings'
import { SSM } from 'aws-sdk'
import { GQLError } from '../GQLError'
import { Either, isLeft } from 'fp-ts/lib/Either'
import { ErrorInfo, ErrorType } from '../../errors/ErrorInfo'
import { pipe } from 'fp-ts/lib/pipeable'
import { v2Client, ResolvableCollection } from '@distributeaid/flexport-sdk'
import { Option, isSome } from 'fp-ts/lib/Option'

const fetchSettings = getFlexportSettings({
	ssm: new SSM(),
	scopePrefix: process.env.STACK_NAME as string,
})
let flexportSettings: Promise<Either<ErrorInfo, FlexportSettings>>

const toLink = (o: Option<ResolvableCollection>): string | undefined =>
	isSome(o) ? o.value.link : undefined

export const handler = async (event: {}, context: Context) => {
	console.log(JSON.stringify({ event }))

	if (!flexportSettings) {
		flexportSettings = fetchSettings()
	}
	const maybeSettings = await flexportSettings
	if (isLeft(maybeSettings)) return GQLError(context, maybeSettings.left)

	const { apiKey } = maybeSettings.right

	const client = v2Client({ apiKey })

	const shipments = await pipe(client.shipment_index())()

	if (isLeft(shipments)) {
		return GQLError(context, {
			message: shipments.left.message,
			type: ErrorType.BadGateway,
		})
	}

	const res = {
		...shipments.right,
		items: shipments.right.items.map((shipment) => ({
			...shipment,
			legs: toLink(shipment.legs),
			customs_entries: toLink(shipment.customs_entries),
			commercial_invoices: toLink(shipment.commercial_invoices),
			documents: toLink(shipment.documents),
		})),
	}

	console.log(JSON.stringify(res))

	return res
}
