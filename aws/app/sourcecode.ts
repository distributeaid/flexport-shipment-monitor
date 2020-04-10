import { App } from '@aws-cdk/core'
import { LambdaSourcecodeStorageStack } from '../stacks/lambda-sourcecode-storage'

/**
 * In order to deploy lambda functions we need to publish them on an S3 bucket.
 * This app provides the bucket and run before the main app.
 */
export class SourceCodeApp extends App {
	constructor(stackName: string) {
		super()

		new LambdaSourcecodeStorageStack(this, stackName)
	}
}
