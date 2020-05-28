import { App } from '@aws-cdk/core'
import { TestExtrasStack } from '../stacks/test-extras'
import { TestExtrasLayeredLambdas } from '../resources/test-extras-lambdas'

export class TestExtrasApp extends App {
	constructor(
		stackName: string,
		sourceCodeBucketName: string,
		baseLayerZipFileName: string,
		layeredLambdas: TestExtrasLayeredLambdas,
	) {
		super()

		new TestExtrasStack(
			this,
			stackName,
			sourceCodeBucketName,
			baseLayerZipFileName,
			layeredLambdas,
		)
	}
}
