import {
	getSlackSettings,
	SlackSettings,
} from '../../../settings/getSlackSettings'
import { SSM } from 'aws-sdk'
import { ErrorInfo } from '../../../errors/ErrorInfo'
import { Either, isLeft } from 'fp-ts/lib/Either'
import {
	getFlexportSettings,
	FlexportSettings,
} from '../../../settings/getFlexportSettings'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceT } from 'fp-ts/lib/Apply'
import {
	v2Client,
	paginate,
	liftShipment,
	LiftedShipment,
} from '@distributeaid/flexport-sdk'
import fetch from 'node-fetch'
import { e } from './escape'
import { formatDistanceToNow, differenceInDays } from 'date-fns'

const ssm = new SSM()
const scopePrefix = process.env.STACK_NAME as string
const webhookOverride = process.env.WEBHOOK_URL

const slackSettingsFetcher = getSlackSettings({
	ssm,
	scopePrefix,
})
const flexportSettingsFetcher = getFlexportSettings({
	ssm,
	scopePrefix,
})
let settings: Promise<Either<
	ErrorInfo,
	{
		slack: SlackSettings
		flexport: FlexportSettings
	}
>>

export const filterOutOldShipment = (s: LiftedShipment): boolean =>
	s.status !== 'final_destination' &&
	differenceInDays(s.actual_arrival_date ?? new Date(), new Date()) > 2
		? false
		: true

export const handler = async (): Promise<void> => {
	if (settings === undefined) {
		settings = pipe(
			sequenceT(TE.taskEither)(slackSettingsFetcher, flexportSettingsFetcher),
			TE.map(([slack, flexport]) => ({
				slack: {
					...slack,
					webhook: webhookOverride ?? slack.webhook,
				},
				flexport,
			})),
		)()
	}
	const maybeSettings = await settings
	if (isLeft(maybeSettings)) {
		console.error(JSON.stringify(maybeSettings.left))
		return
	}

	const { webhook } = maybeSettings.right.slack
	console.log(JSON.stringify({ webhook }))

	const flexportClient = v2Client({
		apiKey: maybeSettings.right.flexport.apiKey,
		endpoint: maybeSettings.right.flexport.endpoint,
	})

	await pipe(
		flexportClient.shipment_index(),
		TE.chain(paginate(flexportClient.resolvePage(liftShipment))),
		TE.mapLeft(console.error),
		TE.map((shipments) => shipments.filter(filterOutOldShipment)),
		TE.chain((shipments) => {
			const req = {
				method: 'POST',
				body: JSON.stringify({
					text: 'Daily shipment update:',
					blocks: [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: 'Daily shipment update:',
							},
						},
						{
							type: 'divider',
						},
						...shipments
							.sort(
								(
									{ updated_at: u1, created_date: c1 },
									{ updated_at: u2, created_date: c2 },
								) =>
									(u2 ?? c2)
										.toISOString()
										.localeCompare((u1 ?? c1).toISOString()),
							)
							.map((shipment) => [
								{
									type: 'section',
									fields: [
										{
											type: 'mrkdwn',
											text: `${
												shipment.id
											}: <https://app.flexport.com/shipments/${shipment.id}|${
												e(shipment.name) ?? 'Unknown'
											}>`,
										},
										{
											type: 'mrkdwn',
											text: `*${e(shipment.status)}* (${formatDistanceToNow(
												shipment.updated_at ?? shipment.created_date,
											)} ago)`,
										},
									],
								},
								{
									type: 'divider',
								},
							])
							.flat(),
						{
							type: 'context',
							elements: [
								{
									type: 'image',
									image_url:
										'https://avatars.slack-edge.com/2020-04-12/1056354706722_95e3fe4fe56c78325e48_512.png',
									alt_text: 'Flexport Shipment Monitor',
								},
								{
									type: 'mrkdwn',
									text:
										'<https://github.com/distributeaid/flexport-shipment-monitor|Flexport Shipment Monitor>',
								},
							],
						},
					],
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}

			console.log(JSON.stringify(req))

			return TE.tryCatch(
				async () => fetch(webhook, req),
				(err) => console.error({ notifySlack: JSON.stringify(err) }),
			)
		}),
	)()
}
