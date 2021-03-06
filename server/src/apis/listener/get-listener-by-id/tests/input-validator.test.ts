import { TestUtils, TestUserContextBuilder, IUserContext, BlockRelationship } from '../../../../global'
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
    await new InputValidator().validate({ listenerId: listener.user.userId }, dj)
  })

  it(`${TEST_TITLE} Given non blocked users, it should throw an error`, async () => {
    await BlockRelationship.create({ blockeeId: listener.user.userId, blockerId: dj.user.userId })
    const error = await new InputValidator()
      .validate({ listenerId: listener.user.userId }, dj)
      .catch(error => error)
    equal(error.message, EError.CANNOT_FIND_LISTENER)
  })

  it(`${TEST_TITLE} Given non existed djId, it should throw an error`, async () => {
    const NEVER_EXISTS_LISTENER_ID = 0
    const error = await new InputValidator()
      .validate({ listenerId: NEVER_EXISTS_LISTENER_ID }, dj)
      .catch(error => error)
    equal(error.message, EError.CANNOT_FIND_LISTENER)
  })
})
