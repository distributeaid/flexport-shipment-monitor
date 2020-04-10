import { SourceCodeApp } from './app/sourcecode'
import { stackName } from './stackName'
;(async () => {
	new SourceCodeApp(stackName('sourcecode')).synth()
})().catch((err) => {
	console.error(err.message)
	process.exit(1)
})
