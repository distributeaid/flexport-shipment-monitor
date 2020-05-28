import { CloudFormation, CloudWatchLogs } from 'aws-sdk'
import * as chalk from 'chalk'
import { stackName } from '../aws/stackName'

const cf = new CloudFormation()
const logs = new CloudWatchLogs()

const main = async () => {
	const logGroups =
		(
			await cf.describeStackResources({ StackName: stackName() }).promise()
		).StackResources?.filter(
			({ ResourceType }) => ResourceType === 'AWS::Logs::LogGroup',
		)?.map(({ PhysicalResourceId }) => PhysicalResourceId as string) ??
		([] as string[])

	const streams = await Promise.all(
		logGroups.map(async (logGroupName) => {
			const { logStreams } = await logs
				.describeLogStreams({
					logGroupName,
					orderBy: 'LastEventTime',
					descending: true,
					limit: 1,
				})
				.promise()
			return {
				logGroupName,
				logStreams:
					logStreams?.map(({ logStreamName }) => logStreamName as string) ?? [],
			}
		}),
	)

	await Promise.all(
		streams.map(async ({ logGroupName, logStreams }) => {
			const l = await Promise.all(
				logStreams.map(async (logStreamName) =>
					logs
						.getLogEvents({
							logGroupName,
							logStreamName,
							startFromHead: false,
							limit: 100,
						})
						.promise(),
				),
			)
			console.log(chalk.yellow(logGroupName))
			l.forEach((x) => {
				x.events
					?.filter(
						({ message }) =>
							!/^(START|END|REPORT) RequestId:/.test(message ?? ''),
					)
					?.filter(({ message }) => message?.includes('\tERROR\t'))
					?.forEach((e) => {
						const m = e.message?.trim()
						const [ts, , type, payload, ...rest] = m?.split('\t') ?? []
						let p: any
						try {
							p = JSON.parse(payload)
						} catch {
							p = {}
						}
						const { type: t, message } = p
						console.log(
							chalk.gray(ts),
							type === 'ERROR'
								? chalk.red(`[${t ?? type}]`)
								: chalk.cyan(`[${type}]`),
							type === 'ERROR' && (message as string | undefined) !== undefined
								? message
								: `${payload}\t${rest}`,
						)
					})
			})
		}),
	)
}

main().catch((err) => {
	console.error(chalk.red(err.message))
	process.exit(1)
})
