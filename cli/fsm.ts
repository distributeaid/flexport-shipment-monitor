import * as program from 'commander'
import * as chalk from 'chalk'
import { listCommand } from './commands/list'
import { SSM } from 'aws-sdk'
import { getFlexportSettings } from '../settings/getFlexportSettings'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { v2Client } from '@distributeaid/flexport-sdk'
import { showCommand } from './commands/show'

const flexportSettingsFetcher = getFlexportSettings({
	ssm: new SSM(),
	scopePrefix: process.env.STACK_NAME as string,
})

const fsmCLI = async () => {
	program.description('Flexport Shipment Monitor')

	const flexportClient = () =>
		pipe(
			flexportSettingsFetcher,
			TE.map((settings) =>
				v2Client({ apiKey: settings.apiKey, endpoint: settings.endpoint }),
			),
		)

	const commands = [
		listCommand({
			flexportClient,
		}),
		showCommand({ flexportClient }),
	]

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
