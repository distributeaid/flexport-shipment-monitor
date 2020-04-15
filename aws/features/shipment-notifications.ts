import * as CDK from '@aws-cdk/core'
import * as DynamoDB from '@aws-cdk/aws-dynamodb'
import * as Lambda from '@aws-cdk/aws-lambda'
import * as IAM from '@aws-cdk/aws-iam'
import * as Logs from '@aws-cdk/aws-logs'
import * as HttpApi from '@aws-cdk/aws-apigatewayv2'

export class ShipmentNotificationFeature extends CDK.Construct {
	public readonly shipmentEventsTable: DynamoDB.Table
	public readonly flexportWebhookReceiver: HttpApi.CfnApi

	constructor(
		stack: CDK.Stack,
		id: string,
		isTest: boolean,
		lambdas: {
			receiveFlexportWebhooks: Lambda.Code
		},
		baseLayer: Lambda.ILayerVersion,
	) {
		super(stack, id)

		// Stores shipment events received by the webhook
		this.shipmentEventsTable = new DynamoDB.Table(this, 'shipmentEvents', {
			billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
			partitionKey: {
				name: 'id',
				type: DynamoDB.AttributeType.NUMBER,
			},
			sortKey: {
				name: 'occurred_at',
				type: DynamoDB.AttributeType.STRING,
			},
			pointInTimeRecovery: true,
			removalPolicy: isTest
				? CDK.RemovalPolicy.DESTROY
				: CDK.RemovalPolicy.RETAIN,
			stream: DynamoDB.StreamViewType.NEW_IMAGE,
		})

		const receiveFlexportWebhooksLambda = new Lambda.Function(
			this,
			`receiveFlexportWebhooksLambda`,
			{
				handler: 'index.handler',
				runtime: Lambda.Runtime.NODEJS_12_X,
				timeout: CDK.Duration.seconds(30),
				memorySize: 1792,
				description: 'Receives webhook requests from Flexport',
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
						actions: ['dynamoDb:PutItem'],
						resources: [this.shipmentEventsTable.tableArn],
					}),
				],
				environment: {
					SHIPMENT_EVENTS_TABLE: this.shipmentEventsTable.tableName,
				},
				layers: [baseLayer],
				code: lambdas.receiveFlexportWebhooks,
			},
		)

		new Logs.LogGroup(this, `receiveFlexportWebhooksLambdaLogGroup`, {
			removalPolicy: CDK.RemovalPolicy.DESTROY,
			logGroupName: `/aws/lambda/${receiveFlexportWebhooksLambda.functionName}`,
			retention: Logs.RetentionDays.ONE_WEEK,
		})

		this.flexportWebhookReceiver = new HttpApi.CfnApi(this, 'httpApi', {
			name: 'Flexport Webhook Receiver',
			description: 'API Gateway to receive Flexport webhook requests',
			protocolType: 'HTTP',
			target: receiveFlexportWebhooksLambda.functionArn,
		})

		// API Gateway needs to be able to call the lambda
		receiveFlexportWebhooksLambda.addPermission('invokeByHttpApi', {
			principal: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
			sourceArn: `arn:aws:execute-api:${stack.region}:${stack.account}:${this.flexportWebhookReceiver.ref}/*/$default`,
		})
	}
}
