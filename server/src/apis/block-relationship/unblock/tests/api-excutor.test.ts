import { TestUtils, TestUserContextBuilder, IUserContext, BlockRelationship } from '../../../../global'
import { ApiExcutor } from '../service'
import { ok } from 'assert'
import { isNil } from 'lodash'

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

    await BlockRelationship.findOne({ blockerId: listener.userId, blockeeId: dj.userId })
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    await new ApiExcutor().excute({ userId: dj.userId }, listener)
    const relationship = await BlockRelationship.findOne({ blockerId: listener.userId, blockeeId: dj.userId })
    ok(isNil(relationship))
  })
})
