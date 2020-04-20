import { TestUtils, TestUserContextBuilder, IUserContext, BlockRelationship } from '../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EError } from '../metadata'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUserContext
  let dj: IUserContext

  beforeEach(async () => {
    listener = await TestUserContextBuilder
      .create({ email: 'listener@gmail.com' })
      .isListener()
      .build()

    dj = await TestUserContextBuilder
      .create({ email: 'dj@gmail.com' })
      .isDj()
      .build()
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await new InputValidator().validate({ userId: dj.userId }, listener)
  })

  it(`${TEST_TITLE} Given non blocked users, it should throw an error`, async () => {
    await BlockRelationship.create({ blockeeId: listener.userId, blockerId: dj.userId })
    const error = await new InputValidator()
      .validate({ userId: dj.userId }, listener)
      .catch(error => error)
    equal(error.message, EError.ALREADY_BLOCKED)
  })

  it(`${TEST_TITLE} Given non existed djId, it should throw an error`, async () => {
    const NEVER_EXISTS_DJ_ID = 0
    const error = await new InputValidator()
      .validate({ userId: NEVER_EXISTS_DJ_ID }, listener)
      .catch(error => error)
    equal(error.message, EError.CANNOT_FIND_USER)
  })
})