import { TaskEither, taskEither } from 'fp-ts/lib/TaskEither'
import { Either, either } from 'fp-ts/lib/Either'
import { Option } from 'fp-ts/lib/Option'
import { getOptionM } from 'fp-ts/lib/OptionT'

const MTE = getOptionM(taskEither)
export const TE = <E, A>(
	onNone: () => TaskEither<E, A>,
): ((ma: TaskEither<E, Option<A>>) => TaskEither<E, A>) => (ma) =>
	MTE.getOrElse(ma, onNone)

const MT = getOptionM(either)
export const E = <E, A>(
	onNone: () => Either<E, A>,
): ((ma: Either<E, Option<A>>) => Either<E, A>) => (ma) =>
	MT.getOrElse(ma, onNone)

export const getOrElse = {
	TE,
	E,
}
