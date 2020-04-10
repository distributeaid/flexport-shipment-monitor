import { Some, Option } from 'fp-ts/lib/Option'

export const unwrapOptionalKeys = <A>(o: { [key: string]: Option<unknown> }) =>
	Object.entries(o).reduce(
		(o, [k, v]) => ({
			...o,
			[k]: (v as Some<unknown>).value,
		}),
		{} as A,
	)
