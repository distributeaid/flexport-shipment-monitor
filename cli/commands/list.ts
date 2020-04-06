import { ComandDefinition } from './CommandDefinition'
import * as chalk from 'chalk'
import { Client } from '@distributeaid/flexport-sdk'

export const listCommand = ({
	flexportClient,
}: {
	flexportClient: Client
}): ComandDefinition => ({
	command: 'list',
	action: async () => {
		const res = await flexportClient.listAllShipments()

		res.data.forEach(shipment => {
			console.log(
				chalk.grey('-'),
				chalk.yellow(`#${shipment.id}`),
				chalk.white(shipment.name),
			)
		})
	},
	help: 'List shipments',
})
