import { LambdaSourcecodeStorageStack } from './stacks/lambda-sourcecode-storage'
import * as fs from 'fs'
import { packBaseLayer } from '@bifravst/package-layered-lambdas'
import { lambdas } from './resources/lambdas'
import { FlexportShipmentMonitorApp } from './app/flexport-shipment-monitor'
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

	new FlexportShipmentMonitorApp(
		stackName(),
		Bucket,
		await packBaseLayer({
			srcDir: rootDir,
			outDir,
			Bucket,
		}),
		layeredLambdas,
		process.env.CI === '1' || process.env.IS_TEST === '1',
	).synth()
})().catch((err) => {
	console.error(err.message)
	process.exit(1)
})
