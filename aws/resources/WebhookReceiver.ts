import * as CDK from '@aws-cdk/core'
import * as SQS from '@aws-cdk/aws-sqs'
import * as IAM from '@aws-cdk/aws-iam'
import * as Logs from '@aws-cdk/aws-logs'
import * as Lambda from '@aws-cdk/aws-lambda'
import * as ApiGateway from '@aws-cdk/aws-apigateway'

/**
 * Sets up resources to receive webhook requests sent by the Slack notification feature
 */
export class WebhookReceiver extends CDK.Construct {
	public readonly queue: SQS.Queue
	public readonly api: ApiGateway.RestApi

	constructor(
		parent: CDK.Stack,
		id: string,
		{
			webhookReceiverLambda,
			baseLayer,
		}: {
			webhookReceiverLambda: Lambda.Code
			baseLayer: Lambda.ILayerVersion
		},
	) {
		super(parent, id)

		// This queue will store all the received webhook requests
		this.queue = new SQS.Queue(this, 'queue', {
			fifo: true,
			visibilityTimeout: CDK.Duration.minutes(5),
			queueName: `${`${id}-${parent.stackName}`.substr(0, 75)}.fifo`,
		})

		// This lambda will publish all requests made to the API Gateway in the queue
		const lambda = new Lambda.Function(this, 'Lambda', {
			description: `Receives webhook requests from the Slack notification feature`,
			code: webhookReceiverLambda,
			layers: [baseLayer],
			handler: 'index.handler',
			runtime: Lambda.Runtime.NODEJS_12_X,
			timeout: CDK.Duration.seconds(15),
			initialPolicy: [
				new IAM.PolicyStatement({
					resources: ['arn:aws:logs:*:*:*'],
					actions: [
						'logs:CreateLogGroup',
						'logs:CreateLogStream',
						'logs:PutLogEvents',
					],
				}),
				new IAM.PolicyStatement({
					resources: [this.queue.queueArn],
					actions: ['sqs:SendMessage'],
				}),
			],
			environment: {
				SQS_QUEUE: this.queue.queueUrl,
			},
		})
		// Create the log group here, so we can control the retention
		new Logs.LogGroup(this, `LambdaLogGroup`, {
			removalPolicy: CDK.RemovalPolicy.DESTROY,
			logGroupName: `/aws/lambda/${lambda.functionName}`,
			retention: Logs.RetentionDays.ONE_DAY,
		})

		// This is the API Gateway, AWS CDK automatically creates a prod stage and deployment
		this.api = new ApiGateway.RestApi(this, 'api', {
			restApiName: 'Webhook Receiver API',
			description: 'API Gateway to test webhook deliveries',
			endpointTypes: [ApiGateway.EndpointType.REGIONAL],
		})
		const proxyResource = this.api.root.addResource('{proxy+}')
		proxyResource.addMethod('ANY', new ApiGateway.LambdaIntegration(lambda))
		// API Gateway needs to be able to call the lambda
		lambda.addPermission('InvokeByApiGateway', {
			principal: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
			sourceArn: this.api.arnForExecuteApi(),
		})
	}
}
