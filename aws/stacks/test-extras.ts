import { App, CfnOutput, Stack } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { WebhookReceiver } from '../resources/WebhookReceiver'
import { TestExtrasLayeredLambdas } from '../resources/test-extras-lambdas'
import { Code, LayerVersion, Runtime } from '@aws-cdk/aws-lambda'
import { FlexportMockApi } from '../resources/FlexportMockApi'

/**
 * This stack provides extras required for the end-to-end tests
 */
export class TestExtrasStack extends Stack {
	constructor(
		parent: App,
		id: string,
		sourceCodeBucketName: string,
		baseLayerZipFileName: string,
		testExtrasLayerZipFileName: string,
		layeredLambdas: TestExtrasLayeredLambdas,
	) {
		super(parent, id)

		const sourceCodeBucket = Bucket.fromBucketName(
			this,
			'SourceCodeBucket',
			sourceCodeBucketName,
		)

		const baseLayer = new LayerVersion(this, `${id}-layer`, {
			code: Code.bucket(sourceCodeBucket, baseLayerZipFileName),
			compatibleRuntimes: [Runtime.NODEJS_12_X],
		})

		const testExtrasLayer = new LayerVersion(this, `${id}-test-layer`, {
			code: Code.bucket(sourceCodeBucket, testExtrasLayerZipFileName),
			compatibleRuntimes: [Runtime.NODEJS_12_X],
		})

		// Webhook receiver for slack notifications
		const webhookReceiver = new WebhookReceiver(this, 'webhookReceiver', {
			webhookReceiverLambda: Code.bucket(
				sourceCodeBucket,
				layeredLambdas.lambdaZipFileNames.webhookReceiver,
			),
			layers: [baseLayer],
		})
		new CfnOutput(this, 'webhookReceiverApiUrl', {
			value: webhookReceiver.api.url,
			exportName: `${this.stackName}:webhookReceiverApiUrl`,
		})
		new CfnOutput(this, 'webhookReceiverQueueURL', {
			value: webhookReceiver.queue.queueUrl,
			exportName: `${this.stackName}:webhookReceiverQueueURL`,
		})

		// Provides a mock Flexport v2 API
		const flexportMockApi = new FlexportMockApi(this, 'flexportMockApi', {
			flexportMockApiLambda: Code.bucket(
				sourceCodeBucket,
				layeredLambdas.lambdaZipFileNames.flexportMockApi,
			),
			layers: [baseLayer, testExtrasLayer],
		})
		new CfnOutput(this, 'flexportMockApiUrl', {
			value: flexportMockApi.api.url,
			exportName: `${this.stackName}:flexportMockApiUrl`,
		})
		new CfnOutput(this, 'flexportMockApiKey', {
			value: flexportMockApi.apiKey,
			exportName: `${this.stackName}:flexportMockApiKey`,
		})
	}
}

export type TestExtrasStackConfig = {
	webhookReceiverApiUrl: string
	webhookReceiverQueueURL: string
	flexportMockApiUrl: string
	flexportMockApiKey: string
}
