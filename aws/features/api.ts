import { Construct, RemovalPolicy, Stack } from '@aws-cdk/core'
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Code, ILayerVersion } from '@aws-cdk/aws-lambda'
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs'
import {
	CfnGraphQLApi,
	CfnGraphQLSchema,
	CfnApiKey,
} from '@aws-cdk/aws-appsync'
import { readFileSync } from 'fs'
import * as path from 'path'
import { GQLLambda } from '../../appsync/GQLLambda'

export class ApiFeature extends Construct {
	public readonly api: CfnGraphQLApi
	public readonly apiKey: CfnApiKey
	public readonly schema: CfnGraphQLSchema

	constructor(
		stack: Stack,
		id: string,
		lambdas: {
			shipmentsQuery: Code
		},
		baseLayer: ILayerVersion,
	) {
		super(stack, id)

		const apiRole = new Role(this, 'Role', {
			assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
		})
		apiRole.addToPolicy(
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
		)

		this.api = new CfnGraphQLApi(this, 'Api', {
			name: `Flexport Shipment Monitor (${stack.stackName})`,
			authenticationType: 'API_KEY',
			logConfig: {
				fieldLogLevel: 'ALL',
				cloudWatchLogsRoleArn: apiRole.roleArn,
			},
		})

		new LogGroup(this, 'LogGroup', {
			removalPolicy: RemovalPolicy.DESTROY,
			logGroupName: `/aws/appsync/apis/${this.api.attrApiId}`,
			retention: RetentionDays.ONE_WEEK,
		})

		this.schema = new CfnGraphQLSchema(this, 'Schema', {
			apiId: this.api.attrApiId,
			definition: readFileSync(
				path.resolve(process.cwd(), 'appsync', 'schema.graphql'),
				'utf-8',
			),
		})

		new GQLLambda(
			this,
			stack,
			baseLayer,
			this.api,
			this.schema,
			'shipments',
			'Query',
			lambdas.shipmentsQuery,
			[
				new PolicyStatement({
					actions: ['ssm:GetParametersByPath'],
					resources: [
						`arn:aws:ssm:${stack.region}:${stack.account}:parameter/${stack.stackName}/flexport`,
					],
				}),
			],
		)

		const year = new Date().getFullYear()
		this.apiKey = new CfnApiKey(this, `apiKey${year}`, {
			apiId: this.api.attrApiId,
			description: `API key for ${year}`,
			expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
		})
	}
}
