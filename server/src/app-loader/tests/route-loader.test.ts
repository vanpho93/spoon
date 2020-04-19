import td from 'testdouble'
import express from 'express'
import request from 'supertest'
import { TestUtils, EHttpStatusCode, EEnviroment, EMethod, BaseApiService, makeSure, Env } from '../../global'
import { RouteLoader } from '../route-loader'
import { RouteFinder } from '../route-finder'
import { deepEqual, equal } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

class AddService extends BaseApiService {
  async process() {
    if (isNaN(this.req.query.a)) throw new Error('INVALID_PARAM_A')
    makeSure(!isNaN(this.req.query.b), 'INVALID_PARA_B')
    return Number(this.req.query.a) + Number(this.req.query.b)
  }
}

describe(TEST_TITLE, () => {
  beforeEach(TEST_TITLE, () => {
    td.replace(RouteFinder, 'find', () => [
      {
        path: '/add',
        Service: AddService,
        method: EMethod.GET,
      },
    ])
    td.replace(console, 'error')
  })

  it(`${TEST_TITLE} RouteLoader works`, async () => {
    const app = express()
    await RouteLoader.load(app)

    // success case
    const { body: body1 } = await request(app).get('/add').query({ a: 1, b: 2 })
    deepEqual(body1, { success: true, result: 3 })

    // handled error
    const { body: body2, status: status2 } = await request(app).get('/add').query({ a: 1 })
    deepEqual(body2, { success: false, message: 'INVALID_PARA_B' })
    equal(status2, EHttpStatusCode.BAD_REQEUEST)

    // unhandled error in dev envs
    const { body: body3, status: status3 } = await request(app).get('/add').query({ b: 2 })
    deepEqual(body3, { success: false, message: 'INVALID_PARAM_A' })
    equal(status3, EHttpStatusCode.INTERNAL_SERVER_ERROR)
    td.verify(console.error(new Error('INVALID_PARAM_A')))

    // unhandled error in prod env
    td.replace(Env, 'get', () => EEnviroment.PRODUCTION)
    const { body: body4, status: status4 } = await request(app).get('/add').query({ b: 2 })
    deepEqual(body4, { success: false, message: 'INTERNAL_SERVER_ERROR' })
    equal(status4, EHttpStatusCode.INTERNAL_SERVER_ERROR)
  })
})
