import { deepEqual, equal, ok } from 'assert'
import { TestUtils } from '../../global'
import { JWT } from '../jwt'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} JWT works with valid inputs`, async () => {
    const token = await JWT.createToken({ userId: 1 })
    const decodedObject = await JWT.verifyToken<{ userId: number }>(token)
    equal(decodedObject.userId, 1)
  })

  it(`${TEST_TITLE} Given invalid input, it should throw an error`, async () => {
    const error = await JWT.createToken(1).catch(error => error)
    ok(error instanceof Error)
  })

  it(`${TEST_TITLE} Given invalid input, it should throw an error`, async () => {
    const error = await JWT.verifyToken('a.b.c').catch(error => error)
    ok(error instanceof Error)
  })
})
