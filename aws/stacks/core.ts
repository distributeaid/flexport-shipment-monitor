import { App, CfnOutput, Stack } from '@aws-cdk/core'
import { Code, LayerVersion, Runtime } from '@aws-cdk/aws-lambda'
import { Bucket } from '@aws-cdk/aws-s3'
import { FlexportShipmentMonitorLambdas } from '../resources/lambdas'
import { ApiFeature } from '../features/api'
import { ShipmentNotificationFeature } from '../features/shipment-notifications'
import { SlackNotificationsFeature } from '../features/slack-notifications'

export class CoreStack extends Stack {
	constructor(
		parent: App,
		id: string,
		sourceCodeBucketName: string,
		baseLayerZipFileName: string,
		layeredLambdas: FlexportShipmentMonitorLambdas,
		isTest: boolean,
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

		const api = new ApiFeature(
			this,
			'api',
			{
				shipmentsQuery: Code.bucket(
					sourceCodeBucket,
					layeredLambdas.lambdaZipFileNames.shipmentsQuery,
				),
				shipmentLegsQuery: Code.bucket(
					sourceCodeBucket,
					layeredLambdas.lambdaZipFileNames.shipmentLegsQuery,
				),
			},
			baseLayer,
		)

		new CfnOutput(this, 'apiUrl', {
			value: api.api.attrGraphQlUrl,
			exportName: `${this.stackName}:apiUrl`,
		})

		new CfnOutput(this, 'apiKey', {
			value: api.apiKey.attrApiKey,
			exportName: `${this.stackName}:apiKey`,
		})

		const notifications = new ShipmentNotificationFeature(
			this,
			'notifications',
			isTest,
			{
				receiveFlexportWebhooks: Code.bucket(
					sourceCodeBucket,
					layeredLambdas.lambdaZipFileNames.receiveFlexportWebhooks,
				),
			},
			baseLayer,
		)

		new CfnOutput(this, 'flexportWebhookReceiverURL', {
			value: `https://${notifications.flexportWebhookReceiver.ref}.execute-api.${this.region}.amazonaws.com`,
			exportName: `${this.stackName}:flexportWebhookReceiverURL`,
		})

		const slackNotifications = new SlackNotificationsFeature(
			this,
			'slackNotifications',
			{
				shipmentUpdate: Code.bucket(
					sourceCodeBucket,
					layeredLambdas.lambdaZipFileNames.shipmentUpdateSlackNotification,
				),
				shipmentSummary: Code.bucket(
					sourceCodeBucket,
					layeredLambdas.lambdaZipFileNames.shipmentSummarySlackNotification,
				),
			},
			baseLayer,
			notifications,
		)

		new CfnOutput(this, 'slackNotificationShipmentSummaryLambdaName', {
			value: slackNotifications.shipmentSummaryLambda.functionName,
			exportName: `${this.stackName}:slackNotificationShipmentSummaryLambdaName`,
		})
	}
}

export type StackConfig = {
	apiUrl: string
	apiKey: string
	flexportWebhookReceiverURL: string
	slackNotificationShipmentSummaryLambdaName: string
}
