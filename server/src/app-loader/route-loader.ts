import { isNil, defaultTo } from 'lodash'

import { Express } from 'express'
import { Env, EEnvKey, EEnviroment, UserContextManager, IRoute, ApiError } from '../global'
import { RouteFinder } from './route-finder'

export class RouteLoader {
  static async load(app: Express) {
    const routes = await RouteFinder.find()
    await Promise.all(routes.map(route => this.appendRoute(app, route)))
  }

  static async appendRoute(app: Express, route: IRoute) {
    app[route.method](route.path, async (req, res) => {
      try {
        const userContext = await UserContextManager.getUserContext(req)
        const service = new route.Service(req, userContext)
        const result = await service.process()
        res.send({ success: true, result })
      } catch (error) {
        if (isNil(error.statusCode)) console.error(error)
        const statusCode = defaultTo(error.statusCode, 500)
        res.status(statusCode).send({ success: false, message: this.getErrorMessage(error) })
      }
    })
  }

  private static getErrorMessage (error: ApiError) {
    if (isNil(error.statusCode) && Env.get(EEnvKey.NODE_ENV) === EEnviroment.PRODUCTION) return 'INTERNAL_SERVER_ERROR'
    return error.message
  }
}
