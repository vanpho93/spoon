import { TestUtils, JWT, EAccountType } from '../../../global'
import { deepEqual, ok } from 'assert'
import { UserContextManager } from '../user-context'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} UserContextManager works with valid token`, async () => {
    const token = await JWT.createToken({ userId: 1, accountType: EAccountType.DJ })
    const userContext = await UserContextManager.getUserContext({ headers: { token } })
    deepEqual(userContext, { userId: 1, accountType: EAccountType.DJ })

    ok(userContext.isUser)
    ok(userContext.isDj)
    ok(!userContext.isListener)
  })

  it(`${TEST_TITLE} UserContextManager works with invalid token`, async () => {
    const userContext = await UserContextManager.getUserContext({ headers: { token: 'a.b.c' } })
    deepEqual(userContext, { userId: undefined, accountType: undefined })
  })
  
  it(`${TEST_TITLE} UserContextManager works with no token`, async () => {
    const userContext = await UserContextManager.getUserContext({ headers: {} })
    deepEqual(userContext, { userId: undefined, accountType: undefined })
  })
})
