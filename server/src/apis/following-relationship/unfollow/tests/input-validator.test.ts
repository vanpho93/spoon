import { TestUtils, TestUserContextBuilder, IUserContext, FollowingRelationship } from '../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EError } from '../metadata'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUserContext
  let dj: IUserContext

  beforeEach(async () => {
    listener = await TestUserContextBuilder.create({ email: 'listener@gmail.com', isListener: true })
    dj = await TestUserContextBuilder.create({ email: 'dj@gmail.com', isDj: true })
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await FollowingRelationship.create({
      listenerId: listener.user.userId,
      djId: dj.user.userId,
    })
    await new InputValidator().validate({ djId: dj.user.userId }, listener)
  })

  it(`${TEST_TITLE} Given has not followed user, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ djId: dj.user.userId }, listener)
      .catch(error => error)
    equal(error.message, EError.NOT_FOLLOWED)
  })
})
