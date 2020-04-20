import { IUserContext } from './user-context'

export enum EMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

type Any = any

export interface IRequest {
  params?: Any
  body?: Any
  headers?: Any
  query?: Any
}

export abstract class BaseApiService {
  protected req: IRequest
  protected userContext: IUserContext

  abstract process(): Promise<unknown>

  public setContext(req: IRequest, userContext: IUserContext) {
    this.req = req
    this.userContext = userContext
    return this
  }
}

export interface IRoute {
  path: string
  method: EMethod
  service: BaseApiService
}

export enum EHttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQEUEST = 400,
  UNAUTHORIZED = 401,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class ApiError extends Error {
  constructor(message: string, public statusCode: EHttpStatusCode) {
    super(message)
  }
}
