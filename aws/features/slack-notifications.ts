import * as CDK from '@aws-cdk/core'
import * as Lambda from '@aws-cdk/aws-lambda'
import * as IAM from '@aws-cdk/aws-iam'
import * as Logs from '@aws-cdk/aws-logs'
import * as Events from '@aws-cdk/aws-events'
import * as EventTargets from '@aws-cdk/aws-events-targets'
import { ShipmentNotificationFeature } from './shipment-notifications'

export class SlackNotificationsFeature extends CDK.Construct {
	public readonly shipmentSummaryLambda: Lambda.Function
	constructor(
		stack: CDK.Stack,
		id: string,
		lambdas: {
			shipmentUpdate: Lambda.Code
			shipmentSummary: Lambda.Code
		},
		baseLayer: Lambda.ILayerVersion,
		shipmentNotifications: ShipmentNotificationFeature,
	) {
		super(stack, id)

		const shipmentUpdateLambda = new Lambda.Function(
			this,
			'shipmentUpdateLambda',
			{
				handler: 'index.handler',
				runtime: Lambda.Runtime.NODEJS_12_X,
				timeout: CDK.Duration.seconds(30),
				memorySize: 1792,
				description: 'Post notification about a shipment update in Slack',
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
							shipmentNotifications.shipmentEventsTable.tableStreamArn ?? '',
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
				code: lambdas.shipmentUpdate,
			},
		)

		new Logs.LogGroup(this, `shipmentUpdateLambdaLogGroup`, {
			removalPolicy: CDK.RemovalPolicy.DESTROY,
			logGroupName: `/aws/lambda/${shipmentUpdateLambda.functionName}`,
			retention: Logs.RetentionDays.ONE_WEEK,
		})

		new Lambda.EventSourceMapping(this, 'ShipmentUpdateEventSourceMapping', {
			eventSourceArn:
				shipmentNotifications.shipmentEventsTable.tableStreamArn ?? '',
			target: shipmentUpdateLambda,
			startingPosition: Lambda.StartingPosition.LATEST,
			batchSize: 1000,
		})

		// Publish daily shipment summary
		this.shipmentSummaryLambda = new Lambda.Function(
			this,
			'shipmentSummaryLambda',
			{
				handler: 'index.handler',
				runtime: Lambda.Runtime.NODEJS_12_X,
				timeout: CDK.Duration.seconds(30),
				memorySize: 1792,
				description: 'Post a summary of all shipments in Slack',
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
							`arn:aws:ssm:${stack.region}:${stack.account}:parameter/${stack.stackName}/flexport`,
						],
					}),
				],
				environment: {
					STACK_NAME: stack.stackName,
				},
				layers: [baseLayer],
				code: lambdas.shipmentSummary,
			},
		)

		const rule = new Events.Rule(this, 'invokeShipmentSummaryRule', {
			schedule: Events.Schedule.expression('cron(0 0 * * ? *)'),
			description:
				'Invoke the lambda which posts a summary of all shipments in Slack',
			enabled: true,
			targets: [new EventTargets.LambdaFunction(this.shipmentSummaryLambda)],
		})

		this.shipmentSummaryLambda.addPermission('InvokeByEvents', {
			principal: new IAM.ServicePrincipal('events.amazonaws.com'),
			sourceArn: rule.ruleArn,
		})
	}
}
