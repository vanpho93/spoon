import { TestUtils, FollowingRelationship, TestUserContextBuilder, IUserContext, Dj, Listener } from '../../../../global'
import { ApiExcutor } from '../service'
import { ok, equal } from 'assert'
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
    await FollowingRelationship.create({
      listenerId: listener.userId,
      djId: dj.userId,
    })
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    await new ApiExcutor().excute({ djId: dj.userId }, listener)
    const relationship = await FollowingRelationship.findOne({ listenerId: listener.userId, djId: dj.userId })
    ok(isNil(relationship))

    equal((await Dj.findById(dj.userId)).followerCount, -1)
    equal((await Listener.findById(listener.userId)).followedCount, -1)
  })
})
