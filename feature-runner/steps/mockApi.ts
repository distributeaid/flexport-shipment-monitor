import { regexMatcher } from '@bifravst/e2e-bdd-test-runner'
import { World } from '../run-features'

export const mockApiStepRunners = () => [
	regexMatcher<World>(/^I have the Flexport Mock API$/)(
		async (_, __, runner) => {
			return runner.world.flexportMockApiUrl
		},
	),
]
