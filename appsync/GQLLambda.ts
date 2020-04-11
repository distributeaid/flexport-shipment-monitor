import { Construct, RemovalPolicy, Stack, Duration } from '@aws-cdk/core'
import { PolicyStatement } from '@aws-cdk/aws-iam'
import { Code, Function, ILayerVersion, Runtime } from '@aws-cdk/aws-lambda'
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs'
import { CfnGraphQLApi, CfnGraphQLSchema } from '@aws-cdk/aws-appsync'
import { GQLLambdaResolver, GQLType } from '../aws/resources/GQLLambdaResolver'

export class GQLLambda extends Construct {
	public readonly lambda: Function

	constructor(
		parent: Construct,
		stack: Stack,
		baseLayer: ILayerVersion,
		api: CfnGraphQLApi,
		schema: CfnGraphQLSchema,
		field: string,
		type: GQLType | string,
		lambda: Code,
		policies: PolicyStatement[],
		environment?: {
			[key: string]: any
		},
	) {
		super(parent, `${field}${type}`)

		this.lambda = new Function(this, `Lambda`, {
			handler: 'index.handler',
			runtime: Runtime.NODEJS_12_X,
			timeout: Duration.seconds(30),
			memorySize: 1792,
			description: `AppSync handler lambda for ${type}.${field}`,
			initialPolicy: [
				new PolicyStatement({
					actions: [
						'logs:CreateLogGroup',
						'logs:CreateLogStream',
						'logs:PutLogEvents',
					],
					resources: [
						`arn:aws:logs:${stack.region}:${stack.account}:/aws/lambda/*`,
					],
				}),
				...policies,
			],
			environment: {
				...environment,
				STACK_NAME: stack.stackName,
			},
			layers: [baseLayer],
			code: lambda,
		})

		new LogGroup(this, `LogGroup`, {
			removalPolicy: RemovalPolicy.DESTROY,
			logGroupName: `/aws/lambda/${this.lambda.functionName}`,
			retention: RetentionDays.ONE_WEEK,
		})

		new GQLLambdaResolver(
			this,
			'Resolver',
			api,
			field,
			type,
			this.lambda,
		).node.addDependency(schema)
	}
}
