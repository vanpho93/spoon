import { pick } from 'lodash'
import td from 'testdouble'
import express from 'express'
import request from 'supertest'
import { deepEqual } from 'assert'
import {
  TestUtils, EHttpStatusCode, EEnviroment, EMethod,
  makeSure, Env, handleUnexpectedError, BaseApiService,
} from '../../global'
import { RouteLoader } from '../route-loader'
import { RouteFinder } from '../route-finder'

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
        service: new AddService(),
        method: EMethod.GET,
      },
    ])

    // tslint:disable-next-line: no-require-imports
    td.replace(require('../../global'), 'handleUnexpectedError')
  })

  it(`${TEST_TITLE} RouteLoader works`, async () => {
    const app = express()
    await RouteLoader.load(app)

    // success case
    const response1 = await request(app).get('/add').query({ a: 1, b: 2 })
    deepEqual(
      pick(response1, 'body', 'status'),
      {
        body: { success: true, result: 3 },
        status: EHttpStatusCode.OK,
      }
    )

    // handled error
    const response2 = await request(app).get('/add').query({ a: 1 })
    deepEqual(
      pick(response2, 'body', 'status'),
      {
        body: { success: false, message: 'INVALID_PARA_B' },
        status: EHttpStatusCode.BAD_REQEUEST,
      }
    )

    // unhandled error in dev envs
    const response3 = await request(app).get('/add').query({ b: 2 })
    deepEqual(
      pick(response3, 'body', 'status'),
      {
        body: { success: false, message: 'INVALID_PARAM_A' },
        status: EHttpStatusCode.INTERNAL_SERVER_ERROR,
      }
    )
    td.verify(handleUnexpectedError(new Error('INVALID_PARAM_A')))

    // unhandled error in prod env
    td.replace(Env, 'get', () => EEnviroment.PRODUCTION)
    const response4 = await request(app).get('/add').query({ b: 2 })
    deepEqual(
      pick(response4, 'body', 'status'),
      {
        body: { success: false, message: 'INTERNAL_SERVER_ERROR' },
        status: EHttpStatusCode.INTERNAL_SERVER_ERROR,
      }
    )

    // invalid route
    const response5 = await request(app).get('/invalid-route')
    deepEqual(
      pick(response5, 'body', 'status'),
      {
        body: { success: false, message: 'INVALID_ROUTE' },
        status: EHttpStatusCode.NOT_FOUND,
      }
    )
  })
})
