import * as path from 'path'
import { LayeredLambdas } from '@bifravst/package-layered-lambdas'
import { packLayeredLambdasForCloudFormation } from '../packLambdas'

export type TestExtrasLayeredLambdas = LayeredLambdas<{
	webhookReceiver: string
	flexportMockApi: string
}>

export const lambdas = async (
	rootDir: string,
	outDir: string,
	Bucket: string,
): Promise<TestExtrasLayeredLambdas> =>
	packLayeredLambdasForCloudFormation('test-extras', outDir, Bucket, {
		webhookReceiver: path.resolve(
			rootDir,
			'aws',
			'resources',
			'webhookReceiverLambda.ts',
		),
		flexportMockApi: path.resolve(
			rootDir,
			'aws',
			'resources',
			'flexportMockApiLambda.ts',
		),
	})
