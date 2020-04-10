import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { CloudFormation } from 'aws-sdk'

const cf = new CloudFormation()

/**
 * This stack provides a bucket to store lambdas
 */
export class LambdaSourcecodeStorageStack extends Stack {
	public readonly bucket: Bucket

	constructor(parent: App, id: string) {
		super(parent, id)
		this.bucket = new Bucket(this, 'cf-sourcecode', {
			removalPolicy: RemovalPolicy.RETAIN,
		})

		new CfnOutput(this, 'bucketName', {
			value: this.bucket.bucketName,
			exportName: `${this.stackName}:bucketName`,
		})
	}

	static getBucketName = async (id: string): Promise<string> =>
		cf
			.describeStacks({
				StackName: id,
			})
			.promise()
			.then(({ Stacks }) => {
				if (Stacks === undefined || !Stacks.length) {
					throw new Error(`${id} stack is not available.`)
				} else {
					const stack = Stacks[0]
					const BucketOutput =
						stack.Outputs &&
						stack.Outputs.find(({ OutputKey }) => OutputKey === 'bucketName')
					if (
						BucketOutput === undefined ||
						BucketOutput.OutputValue === undefined
					) {
						throw new Error(`${id} bucket not found.`)
					}
					return BucketOutput.OutputValue
				}
			})
}
