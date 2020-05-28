export const stackName = (extension?: 'sourcecode' | 'test-extras'): string => {
	let name = process.env.STACK_NAME ?? 'flexport-shipment-monitor-dev'
	if (extension !== undefined) name = `${name}-${extension}`
	return name
}
