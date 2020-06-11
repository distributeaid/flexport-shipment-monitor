import * as program from 'commander'
import * as chalk from 'chalk'
import { listCommand } from './commands/list'
import { v2Client } from '@distributeaid/flexport-sdk'

const apiEndpoint = process.env.FLEXPORT_API_ENDPOINT

const flexportClient = v2Client({
	apiKey: process.env.FLEXPORT_API_KEY ?? '',
	...(apiEndpoint !== undefined && { endpoint: apiEndpoint }),
})

const fsmCLI = async () => {
	program.description('Flexport Shipment Monitor')

	const commands = [listCommand({ flexportClient })]

	let ran = false
	commands.forEach(({ command, action, help, options }) => {
		const cmd = program.command(command)
		cmd
			.action(async (...args) => {
				try {
					ran = true
					await action(...args)
				} catch (error) {
					console.error(
						chalk.red.inverse(' ERROR '),
						chalk.red(`${command} failed!`),
					)
					console.error(chalk.red.inverse(' ERROR '), chalk.red(error))
					process.exit(1)
				}
			})
			.on('--help', () => {
				console.log('')
				console.log(chalk.yellow(help))
				console.log('')
			})
		if (options) {
			options.forEach(({ flags, description, defaultValue }) =>
				cmd.option(flags, description, defaultValue),
			)
		}
	})

	program.parse(process.argv)

	if (!ran) {
		program.outputHelp(chalk.yellow)
		throw new Error('No command selected!')
	}
}

fsmCLI().catch((err) => {
	console.error(chalk.red(err))
	process.exit(1)
})
