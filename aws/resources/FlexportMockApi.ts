import * as CDK from '@aws-cdk/core'
import * as IAM from '@aws-cdk/aws-iam'
import * as Logs from '@aws-cdk/aws-logs'
import * as Lambda from '@aws-cdk/aws-lambda'
import * as ApiGateway from '@aws-cdk/aws-apigateway'

/**
 * Sets up resources to receive webhook requests sent by the Slack notification feature
 */
export class FlexportMockApi extends CDK.Construct {
	public readonly api: ApiGateway.RestApi
	public readonly apiKey: string

	constructor(
		parent: CDK.Stack,
		id: string,
		{
			flexportMockApiLambda,
			layers,
		}: {
			flexportMockApiLambda: Lambda.Code
			layers: Lambda.ILayerVersion[]
		},
	) {
		super(parent, id)

		this.apiKey = '3eebcbf5-aa9e-4d34-8ea2-3b7bdd6538d1'

		// This lambda will behave like the Flexport API
		const lambda = new Lambda.Function(this, 'Lambda', {
			description: `Provides a mock Flexport v2 API`,
			code: flexportMockApiLambda,
			layers,
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
			],
			environment: {
				API_KEY: this.apiKey,
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
			restApiName: 'Flexport Mock API',
			description: 'API Gateway to provide a mock Flexport API',
			endpointTypes: [ApiGateway.EndpointType.REGIONAL],
		})
		const proxyResource = this.api.root.addResource('{proxy+}')
		proxyResource.addMethod('ANY', new ApiGateway.LambdaIntegration(lambda), {})
		// API Gateway needs to be able to call the lambda
		lambda.addPermission('InvokeByApiGateway', {
			principal: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
			sourceArn: this.api.arnForExecuteApi(),
		})
	}
}
