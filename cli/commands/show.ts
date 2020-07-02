import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import {
	V2Client,
	createError,
	paginate,
	liftShipmentLeg,
} from '@distributeaid/flexport-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { formatDistanceToNow } from 'date-fns'
import { ErrorInfo } from '../../errors/ErrorInfo'

export const showCommand = ({
	flexportClient,
}: {
	flexportClient: () => TE.TaskEither<ErrorInfo, V2Client>
}): ComandDefinition => ({
	command: 'show <id>',
	action: async (id) => {
		console.log(chalk.gray('Fetching shipment ...'))
		await pipe(
			flexportClient(),
			TE.chainW((client) =>
				pipe(
					client.shipment_show({ id: parseInt(id, 10) }),
					TE.chain((shipment) =>
						pipe(
							TE.right(shipment.legs),
							TE.chain(
								TE.fromOption(() => createError('Shipment has no legs.')),
							),
							TE.chain(client.resolveCollection(liftShipmentLeg)),
							TE.chain(paginate(client.resolvePage(liftShipmentLeg))),
							TE.map((shipmentLegs) => ({ shipment, legs: shipmentLegs })),
						),
					),
				),
			),
			TE.map(({ shipment, legs }) => {
				console.log(chalk.white.bold(shipment.id), chalk.white(shipment.name))
				console.log(chalk.gray('Status'), chalk.blue(shipment.status))
				if (shipment.updated_at !== undefined) {
					console.log(
						chalk.gray('Updated'),
						chalk.yellow(`${formatDistanceToNow(shipment.updated_at)} ago`),
					)
				}
				if (shipment.calculated_weight !== undefined) {
					console.log(
						chalk.gray('Weight'),
						chalk.yellow(
							`${shipment.calculated_weight.value}${shipment.calculated_weight.unit}`,
						),
					)
				}
				legs.sort(
					(l1, l2) =>
						((l1.actual_arrival_date ?? l1.estimated_arrival_date)?.getTime() ??
							0) -
						((l2.actual_arrival_date ?? l2.estimated_arrival_date)?.getTime() ??
							0),
				)
				const firstLeg = legs[0]
				const lastLeg = legs[legs.length - 1]
				console.log(
					chalk.grey('Origin'),
					chalk.yellow(
						`${firstLeg.origin.place.address.city}, ${firstLeg.origin.place.address.country}`,
					),
				)
				console.log(
					chalk.gray('Destination'),
					chalk.yellow(
						`${lastLeg.destination.place.address.city}, ${lastLeg.destination.place.address.country}`,
					),
				)
			}),
		)()
	},
	help: 'Show shipment',
})
