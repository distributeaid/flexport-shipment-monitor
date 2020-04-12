export enum ErrorType {
	EntityNotFound = 'EntityNotFound',
	BadRequest = 'BadRequest',
	AccessDenied = 'AccessDenied',
	InternalError = 'InternalError',
	BadGateway = 'BadGateway',
}

export type ErrorInfo = {
	type: ErrorType
	message: string
}
