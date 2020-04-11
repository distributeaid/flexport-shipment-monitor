import * as path from 'path'
import { LayeredLambdas } from '@bifravst/package-layered-lambdas'
import { packLayeredLambdasForCloudFormation } from '../packLambdas'

export type FlexportShipmentMonitorLambdas = LayeredLambdas<{
	receiveFlexportWebhooks: string
	shipmentsQuery: string
	shipmentLegsQuery: string
}>

export const lambdas = async (
	rootDir: string,
	outDir: string,
	Bucket: string,
): Promise<FlexportShipmentMonitorLambdas> =>
	packLayeredLambdasForCloudFormation(
		'flexport-shipment-monitor',
		outDir,
		Bucket,
		{
			receiveFlexportWebhooks: path.resolve(
				rootDir,
				'notifications',
				'lambda',
				'receiveFlexportWebhooks.ts',
			),
			shipmentsQuery: path.resolve(
				rootDir,
				'appsync',
				'queries',
				'shipments.ts',
			),
			shipmentLegsQuery: path.resolve(
				rootDir,
				'appsync',
				'queries',
				'shipmentLegs.ts',
			),
		},
	)
