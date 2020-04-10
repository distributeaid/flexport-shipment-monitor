import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import { Client } from '@distributeaid/flexport-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'

export const listCommand = ({
	flexportClient,
}: {
	flexportClient: Client
}): ComandDefinition => ({
	command: 'list',
	action: async () => {
		await pipe(
			flexportClient.listAllShipments(),
			TE.map(shipments => {
				shipments.items.forEach(shipment => {
					console.log(
						chalk.grey('-'),
						chalk.yellow(`#${shipment.id}`),
						chalk.white(shipment.name),
						chalk.blue(shipment.status),
					)
				})
			}),
		)()
	},
	help: 'List shipments',
})
