import * as CDK from '@aws-cdk/core'
import * as Lambda from '@aws-cdk/aws-lambda'
import * as IAM from '@aws-cdk/aws-iam'
import * as Logs from '@aws-cdk/aws-logs'
import { ShipmentNotificationFeature } from './shipment-notifications'

export class SlackNotificationsFeature extends CDK.Construct {
	constructor(
		stack: CDK.Stack,
		id: string,
		lambdas: {
			notifySlack: Lambda.Code
		},
		baseLayer: Lambda.ILayerVersion,
		shipmentNotifications: ShipmentNotificationFeature,
	) {
		super(stack, id)

		const notifySlackLambda = new Lambda.Function(this, `Lambda`, {
			handler: 'index.handler',
			runtime: Lambda.Runtime.NODEJS_12_X,
			timeout: CDK.Duration.seconds(30),
			memorySize: 1792,
			description: 'Notify Slack channels about shipment events',
			initialPolicy: [
				new IAM.PolicyStatement({
					actions: [
						'logs:CreateLogGroup',
						'logs:CreateLogStream',
						'logs:PutLogEvents',
					],
					resources: [
						`arn:aws:logs:${stack.region}:${stack.account}:/aws/lambda/*`,
					],
				}),
				new IAM.PolicyStatement({
					actions: ['ssm:GetParametersByPath'],
					resources: [
						`arn:aws:ssm:${stack.region}:${stack.account}:parameter/${stack.stackName}/slack`,
					],
				}),
				new IAM.PolicyStatement({
					resources: [
						shipmentNotifications.shipmentEventsTable.tableStreamArn || '',
						`${shipmentNotifications.shipmentEventsTable.tableStreamArn}/*`,
					],
					actions: [
						'dynamodb:GetRecords',
						'dynamodb:GetShardIterator',
						'dynamodb:DescribeStream',
						'dynamodb:ListStreams',
					],
				}),
			],
			environment: {
				STACK_NAME: stack.stackName,
			},
			layers: [baseLayer],
			code: lambdas.notifySlack,
		})

		new Logs.LogGroup(this, `LogGroup`, {
			removalPolicy: CDK.RemovalPolicy.DESTROY,
			logGroupName: `/aws/lambda/${notifySlackLambda.functionName}`,
			retention: Logs.RetentionDays.ONE_WEEK,
		})

		new Lambda.EventSourceMapping(this, 'EventSourceMapping', {
			eventSourceArn:
				shipmentNotifications.shipmentEventsTable.tableStreamArn || '',
			target: notifySlackLambda,
			startingPosition: Lambda.StartingPosition.LATEST,
			batchSize: 1000,
		})
	}
}
