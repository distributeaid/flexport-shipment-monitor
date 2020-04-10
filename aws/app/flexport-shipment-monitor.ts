import { App } from '@aws-cdk/core'
import { FlexportShipmentMonitorLambdas } from '../resources/lambdas'
import { CoreStack } from '../stacks/core'

export class FlexportShipmentMonitorApp extends App {
	constructor(
		stackName: string,
		sourceCodeBucketName: string,
		baseLayerZipFileName: string,
		layeredLambdas: FlexportShipmentMonitorLambdas,
		isTest: boolean,
	) {
		super()

		new CoreStack(
			this,
			stackName,
			sourceCodeBucketName,
			baseLayerZipFileName,
			layeredLambdas,
			isTest,
		)
	}
}
