import { SSM } from 'aws-sdk'
import * as TE from 'fp-ts/lib/TaskEither'
import { Option, fromNullable } from 'fp-ts/lib/Option'
import { ErrorInfo, ErrorType } from '../errors/ErrorInfo'

const findParameterByName = (Path: string, Parameters?: SSM.ParameterList) => (
	name: string,
) =>
	fromNullable(
		Parameters?.find(({ Name }) => Name?.replace(`${Path}/`, '') === name)
			?.Value,
	)

export const getSettings = ({ ssm, scope }: { ssm: SSM; scope: string }) =>
	TE.tryCatch<ErrorInfo, (name: string) => Option<string>>(
		async () => {
			const Path = `/${scope}`
			const { Parameters } = await ssm
				.getParametersByPath({
					Path,
					Recursive: true,
					WithDecryption: true,
				})
				.promise()

			const f = findParameterByName(Path, Parameters)

			return f
		},
		(reason) => ({
			type: ErrorType.InternalError,
			message: `Failed to fetch settings: ${(reason as Error).message}`,
		}),
	)
