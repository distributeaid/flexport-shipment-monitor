import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import { V2Client, paginate, liftShipment } from '@distributeaid/flexport-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { formatDistanceToNow } from 'date-fns'
import { ErrorInfo } from '../../errors/ErrorInfo'

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
				),
			),
			TE.map((shipments) => {
				console.log(chalk.yellow(shipments.length), chalk.white('Shipments'))
				shipments.forEach((shipment) => {
					console.log(
						chalk.grey('-'),
						chalk.yellow(`#${shipment.id}`),
						chalk.white(shipment.name),
						chalk.blue(shipment.status),
						shipment.updated_at !== undefined &&
							chalk.green(`${formatDistanceToNow(shipment.updated_at)} ago`),
					)
				})
			}),
		)()
	},
	help: 'List shipments',
})
