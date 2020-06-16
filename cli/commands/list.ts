import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import {
	V2Client,
	paginate,
	liftShipment,
	liftShipmentLeg,
	createError,
} from '@distributeaid/flexport-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { formatDistanceToNow } from 'date-fns'
import { ErrorInfo } from '../../errors/ErrorInfo'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { getOrElse } from '../../lib/fp-ts.util'

export const listCommand = ({
	flexportClient,
}: {
	flexportClient: () => TE.TaskEither<ErrorInfo, V2Client>
}): ComandDefinition => ({
	command: 'list',
	action: async () => {
		console.log(chalk.gray('Fetching shipments ...'))
		await pipe(
			flexportClient(),
			TE.chainW((client) =>
				pipe(
					client.shipment_index(),
					TE.chain(paginate(client.resolvePage(liftShipment))),
					// Not all shipments have an up to date actual_arrival_date, we might need to look at the shipment legs to determine it
					TE.chainW((shipments) =>
						A.array.traverse(TE.taskEither)(shipments, (shipment) =>
							shipment.status !== 'final_destination' // not arrived, yet
								? TE.right({ shipment, arrivalDate: O.none })
								: pipe(
										TE.right(O.fromNullable(shipment.actual_arrival_date)),
										getOrElse.TE(() =>
											pipe(
												TE.right(shipment.legs),
												TE.chain(
													TE.fromOption(() =>
														createError('Shipment has no legs.'),
													),
												),
												TE.chain(client.resolveCollection(liftShipmentLeg)),
												TE.chain(paginate(client.resolvePage(liftShipmentLeg))),
												TE.map(
													(shipmentLegs) =>
														shipmentLegs.sort(
															(l1, l2) =>
																(l1.actual_arrival_date?.getTime() ?? 0) -
																(l2.actual_arrival_date?.getTime() ?? 0),
														)[shipmentLegs.length - 1]?.actual_arrival_date,
												),
												TE.mapLeft((err) => {
													console.error(err)
													return undefined
												}),
											),
										),
										TE.map((arrivalDate) => ({
											shipment,
											arrivalDate: O.fromNullable(arrivalDate),
										})),
								  ),
						),
					),
				),
			),
			TE.map((shipmentsWithLegs) => {
				console.log(
					chalk.yellow(shipmentsWithLegs.length),
					chalk.white('Shipments'),
				)
				shipmentsWithLegs.forEach(({ shipment, arrivalDate }) => {
					console.log(
						chalk.grey('-'),
						chalk.white.bold(`#${shipment.id}`),
						chalk.white(shipment.name),
						chalk.blue(shipment.status),
						shipment.updated_at !== undefined &&
							chalk.yellow(
								`updated ${formatDistanceToNow(shipment.updated_at)} ago`,
							),
						O.isSome(arrivalDate)
							? chalk.green(
									`arrived ${formatDistanceToNow(arrivalDate.value)} ago`,
							  )
							: '',
					)
				})
			}),
		)()
	},
	help: 'List shipments',
})
