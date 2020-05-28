import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import { V2Client } from '@distributeaid/flexport-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { formatDistanceToNow } from 'date-fns'

export const listCommand = ({
	flexportClient,
}: {
	flexportClient: V2Client
}): ComandDefinition => ({
	command: 'list',
	action: async () => {
		await pipe(
			flexportClient.shipment_index(),
			TE.map((shipments) => {
				shipments.items.forEach((shipment) => {
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
