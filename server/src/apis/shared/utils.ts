import { ApiError, EHttpStatusCode } from '.'

export function makeSure(expression: boolean, message: string, statusCode = EHttpStatusCode.BAD_REQEUEST) {
  if (expression) return
  throw new ApiError(message, statusCode)
}

export function mustExist(value: unknown, message: string, statusCode = EHttpStatusCode.BAD_REQEUEST) {
  if (value) return
  throw new ApiError(message, statusCode)
}
