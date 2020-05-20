import { DynamoDBStreamEvent } from 'aws-lambda'
import {
	getSlackSettings,
	SlackSettings,
} from '../../settings/getSlackSettings'
import { SSM } from 'aws-sdk'
import { ErrorInfo } from '../../errors/ErrorInfo'
import { Either, isLeft } from 'fp-ts/lib/Either'
import fetch from 'node-fetch'
import { MilestoneInfo, ShipmentEventData } from '@distributeaid/flexport-sdk'

const fetchSettings = getSlackSettings({
	ssm: new SSM(),
	scopePrefix: process.env.STACK_NAME as string,
})
let slackSettings: Promise<Either<ErrorInfo, SlackSettings>>

/**
 * Escape special characters
 * @see https://api.slack.com/reference/surfaces/formatting#escaping
 */
const e = (str: string) =>
	str.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
	console.log(JSON.stringify(event))

	if (!slackSettings) {
		slackSettings = fetchSettings()
	}
	const maybeSettings = await slackSettings
	if (isLeft(maybeSettings)) {
		console.error(JSON.stringify(maybeSettings.left))
		return
	}

	const { webhook } = maybeSettings.right

	await Promise.all(
		event.Records.map(async ({ dynamodb }) => {
			if (!dynamodb?.NewImage) return
			const {
				occurred_at: { S: occurred_at },
				type: { S: type },
				data: { S: jsonData },
			} = dynamodb?.NewImage

			if (!type) {
				console.error(
					JSON.stringify({
						error: 'Event has no "type"!',
					}),
				)
				return
			}
			const milestoneInfo = MilestoneInfo[type]
			if (!milestoneInfo) {
				console.error(
					JSON.stringify({
						error: `Unknown type '${type}'!`,
					}),
				)
			}
			let data: ShipmentEventData
			if (!jsonData) {
				console.error(
					JSON.stringify({
						error: `Event has no data!`,
					}),
				)
				return
			} else {
				try {
					data = JSON.parse(jsonData) as ShipmentEventData
				} catch {
					console.error('Failed to parse Data')
					return
				}
			}
			const shipment = data?.shipment
			if (!shipment) {
				console.error(
					JSON.stringify({
						error: `Event has no shipment data!`,
					}),
				)
				return
			}

			const req = {
				method: 'POST',
				body: JSON.stringify({
					text: 'Shipment update received:',
					attachments: [
						{
							fallback: `Shipment ${shipment.id} was updated: ${e(
								milestoneInfo?.name ?? type,
							)}`,
							fields: [
								{
									title: 'Name',
									value: `<https://app.flexport.com/shipments/${shipment.id}|${
										e(shipment.name) ?? 'Unknown'
									}>`,
									short: true,
								},
								{
									title: 'ID',
									value: `<https://app.flexport.com/shipments/${shipment.id}|${shipment.id}>`,
									short: true,
								},
								milestoneInfo
									? {
											title: e(milestoneInfo.name),
											value: e(milestoneInfo.description),
											short: false,
									  }
									: {
											title: 'Unknown event type received',
											value: e(type),
											short: false,
									  },
							],
							footer:
								'<https://github.com/distributeaid/flexport-shipment-monitor|Flexport Shipment Monitor>',
							ts: Math.round(new Date(occurred_at as string).getTime() / 1000),
						},
					],
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}

			console.log(JSON.stringify(req))

			return fetch(webhook, req)
		}),
	)
}
