import * as path from 'path'
import {
	packLayeredLambdas,
	WebpackMode,
} from '@bifravst/package-layered-lambdas'

const rootFolder = path.resolve(__dirname, '..', '..')

export const tsConfig = path.resolve(__dirname, '..', '..', 'tsconfig.json')

export const mode =
	(process.env.WEBPACK_LAMBDAS_MODE as WebpackMode) || WebpackMode.production

export const packLayeredLambdasForCloudFormation = async <
	A extends { [key: string]: string }
>(
	id: string,
	outDir: string,
	Bucket: string,
	lambdas: A,
) =>
	packLayeredLambdas<A>({
		id,
		mode,
		srcDir: rootFolder,
		outDir,
		Bucket,
		lambdas,
		tsConfig,
	})
