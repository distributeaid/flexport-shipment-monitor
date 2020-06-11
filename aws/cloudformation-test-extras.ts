import { TestExtrasApp } from './app/test-extras'
import { LambdaSourcecodeStorageStack } from './stacks/lambda-sourcecode-storage'
import { promises as fs } from 'fs'
import { packBaseLayer } from '@bifravst/package-layered-lambdas'
import { lambdas } from './resources/test-extras-lambdas'
import * as path from 'path'
import { spawn } from 'child_process'
import { stackName } from './stackName'

const main = async () => {
	const outDir = path.resolve(__dirname, '..', '..', 'pack')
	try {
		await fs.stat(outDir)
	} catch (_) {
		await fs.mkdir(outDir)
	}
	const rootDir = path.resolve(__dirname, '..', '..')

	const Bucket = await LambdaSourcecodeStorageStack.getBucketName(
		stackName('sourcecode'),
	)

	const layeredLambdas = await lambdas(rootDir, outDir, Bucket)

	// Create extra layer for test lambdas
	const testLayerDir = path.resolve(__dirname, '..', '..', 'pack', 'testLayer')
	try {
		await fs.stat(testLayerDir)
	} catch (_) {
		await fs.mkdir(testLayerDir)
	}
	const devDeps = JSON.parse(
		await fs.readFile(
			path.resolve(__dirname, '..', '..', 'package.json'),
			'utf-8',
		),
	).devDependencies
	await fs.writeFile(
		path.join(testLayerDir, 'package.json'),
		JSON.stringify({
			dependencies: {
				'@distributeaid/flexport-api-sandbox':
					devDeps['@distributeaid/flexport-api-sandbox'],
			},
		}),
		'utf-8',
	)
	await new Promise((resolve, reject) => {
		const p = spawn('npm', ['i', '--ignore-scripts', '--only=prod'], {
			cwd: testLayerDir,
		})
		p.on('close', (code) => {
			if (code !== 0) {
				const msg = `[Test Extras] npm i in ${testLayerDir} exited with code ${code}.`
				return reject(new Error(msg))
			}
			return resolve()
		})
	})

	new TestExtrasApp(
		stackName('test-extras'),
		Bucket,
		await packBaseLayer({
			srcDir: rootDir,
			outDir,
			Bucket,
		}),
		await packBaseLayer({
			srcDir: testLayerDir,
			outDir,
			Bucket,
		}),
		layeredLambdas,
	).synth()
}

main().catch((err) => {
	console.error(err.message)
	process.exit(1)
})
