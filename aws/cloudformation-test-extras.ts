import { TestExtrasApp } from './app/test-extras'
import { LambdaSourcecodeStorageStack } from './stacks/lambda-sourcecode-storage'
import * as fs from 'fs'
import { packBaseLayer } from '@bifravst/package-layered-lambdas'
import { lambdas } from './resources/test-extras-lambdas'
import * as path from 'path'
import { stackName } from './stackName'
;(async () => {
	const outDir = path.resolve(__dirname, '..', '..', 'pack')
	try {
		fs.statSync(outDir)
	} catch (_) {
		fs.mkdirSync(outDir)
	}
	const rootDir = path.resolve(__dirname, '..', '..')

	const Bucket = await LambdaSourcecodeStorageStack.getBucketName(
		stackName('sourcecode'),
	)

	const layeredLambdas = await lambdas(rootDir, outDir, Bucket)

	new TestExtrasApp(
		stackName('test-extras'),
		Bucket,
		await packBaseLayer({
			srcDir: rootDir,
			outDir,
			Bucket,
		}),
		layeredLambdas,
	).synth()
})().catch((err) => {
	console.error(err.message)
	process.exit(1)
})
