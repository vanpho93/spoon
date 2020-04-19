import { ApiError, EHttpStatusCode } from '.'

export function makeSure(expression: boolean, message = 'INVALID_MAKE_SURE', statusCode = EHttpStatusCode.BAD_REQEUEST) {
  if (expression) return
  throw new ApiError(message, statusCode)
}

export function mustExist(value: unknown, message = 'NOT_EXIST', statusCode = EHttpStatusCode.BAD_REQEUEST) {
  if (value) return
  throw new ApiError(message, statusCode)
}
