import { isNil, defaultTo } from 'lodash'

import { Express } from 'express'
import { Env, EEnvKey, EEnviroment, UserContextManager, IRoute, ApiError, EHttpStatusCode, handleUnexpectedError } from '../global'
import { RouteFinder } from './route-finder'

export class RouteLoader {
  static async load(app: Express) {
    const routes = await RouteFinder.find()
    await Promise.all(routes.map(route => this.appendRoute(app, route)))
    app.all('*', (req, res) => {
      res
        .status(EHttpStatusCode.NOT_FOUND)
        .send({ success: false, message: 'INVALID_ROUTE' })
    })
  }

  private static async appendRoute(app: Express, route: IRoute) {
    app[route.method](route.path, async (req, res) => {
      try {
        const userContext = await UserContextManager.getUserContext(req)
        const result = await route.service.setContext(req, userContext).process()
        res.send({ success: true, result })
      } catch (error) {
        const isUnexpectedError = isNil(error.statusCode)
        if (isUnexpectedError) handleUnexpectedError(error)
        const statusCode = isUnexpectedError ? EHttpStatusCode.INTERNAL_SERVER_ERROR : error.statusCode
        res.status(statusCode).send({ success: false, message: this.getErrorMessage(error) })
      }
    })
  }

  private static getErrorMessage (error: ApiError) {
    if (isNil(error.statusCode) && Env.get(EEnvKey.NODE_ENV) === EEnviroment.PRODUCTION) return 'INTERNAL_SERVER_ERROR'
    return error.message
  }
}
