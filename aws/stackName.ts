export const stackName = (extension?: 'sourcecode') => {
	let name = process.env.STACK_NAME || 'flexport-shipment-monitor-dev'
	if (extension) name = `${name}-${extension}`
	return name
}
