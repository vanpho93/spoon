import { TestUtils, JWT, TestUserContextBuilder } from '../../../global'
import { deepEqual, ok } from 'assert'
import { UserContextManager } from '../user-context'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} UserContextManager works with valid token`, async () => {
    const originalUserContext = await TestUserContextBuilder.create({ isDj: true })
    const token = await JWT.createToken({ userId: originalUserContext.user.userId })
    const userContext = await UserContextManager.getUserContext({ headers: { token } })
    deepEqual(userContext, originalUserContext)

    ok(userContext.isUser)
    ok(userContext.user.isDj)
    ok(!userContext.user.isListener)
  })

  it(`${TEST_TITLE} UserContextManager works with invalid token`, async () => {
    const userContext = await UserContextManager.getUserContext({ headers: { token: 'a.b.c' } })
    deepEqual(userContext, { user: undefined })
  })

  it(`${TEST_TITLE} UserContextManager works with no token`, async () => {
    const userContext = await UserContextManager.getUserContext({ headers: {} })
    deepEqual(userContext, { user: undefined })
  })
})
