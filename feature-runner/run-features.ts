import {
	FeatureRunner,
	fetchStackConfiguration,
	ConsoleReporter,
	webhookStepRunners,
	restStepRunners,
	randomStepRunners,
	awsSdkStepRunners,
} from '@coderbyheart/bdd-feature-runner-aws'
import * as chalk from 'chalk'
import * as program from 'commander'
import { StackConfig } from '../aws/stacks/core'
import { TestExtrasStackConfig } from '../aws/stacks/test-extras'
import { stackName } from '../aws/stackName'
import { mockApiStepRunners } from './steps/mockApi'

let ran = false

export type World = {
	flexportWebhookReceiverURL: string
	region: string
	flexportMockApiUrl: string
	flexportMockApiKey: string
	slackNotificationShipmentSummaryLambdaName: string
}

const region = process.env.AWS_REGION ?? ''

program
	.arguments('<featureDir>')
	.option('-r, --print-results', 'Print results')
	.option('-p, --progress', 'Print progress')
	.action(
		async (
			featureDir: string,
			{
				printResults,
				progress,
			}: { printResults: boolean; stack: string; progress: boolean },
		) => {
			ran = true

			const [stackConfig, testStackConfig] = (await Promise.all([
				fetchStackConfiguration({
					StackName: stackName(),
					region: process.env.AWS_REGION as string,
				}),
				fetchStackConfiguration({
					StackName: stackName('test-extras'),
					region: process.env.AWS_REGION as string,
				}),
			])) as [StackConfig, TestExtrasStackConfig]

			const world: World = {
				flexportWebhookReceiverURL: stackConfig.flexportWebhookReceiverURL,
				slackNotificationShipmentSummaryLambdaName:
					stackConfig.slackNotificationShipmentSummaryLambdaName,
				region,
				flexportMockApiUrl: testStackConfig.flexportMockApiUrl,
				flexportMockApiKey: testStackConfig.flexportMockApiKey,
			}

			console.log(chalk.yellow.bold(' World:'))
			console.log()
			console.log(world)
			console.log()

			const runner = new FeatureRunner<World>(world, {
				dir: featureDir,
				reporters: [
					new ConsoleReporter({
						printResults,
						printProgress: progress,
						printSummary: true,
					}),
				],
			})
			runner
				.addStepRunners(
					webhookStepRunners({
						region,
						webhookQueue: testStackConfig.webhookReceiverQueueURL,
					}),
				)
				.addStepRunners(restStepRunners())
				.addStepRunners(
					randomStepRunners({
						generators: {
							ShipmentID: (): string =>
								`${Math.round(1000000 + Math.random() * 1000000)}`,
						},
					}),
				)
				.addStepRunners(mockApiStepRunners())
				.addStepRunners(
					awsSdkStepRunners({
						region,
					}),
				)

			const { success } = await runner.run()
			if (!success) {
				process.exit(1)
			}
			process.exit()
		},
	)
	.parse(process.argv)

if (!ran) {
	program.outputHelp(chalk.red)
	process.exit(1)
}
