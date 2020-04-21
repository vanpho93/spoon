import {
  TestUtils, FollowingRelationship, TestUserContextBuilder,
  IUserContext, Listener, LazyFanCounter, deepOmit
} from '../../../../global'
import { ApiExcutor } from '../service'
import { ok, equal, deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUserContext
  let dj: IUserContext

  beforeEach(async () => {
    listener = await TestUserContextBuilder.create({ email: 'listener@gmail.com', isListener: true })
    dj = await TestUserContextBuilder.create({ email: 'dj@gmail.com', isDj: true })
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    await new ApiExcutor().excute({ djId: dj.user.userId }, listener)
    const relationship = await FollowingRelationship.findOne({ listenerId: listener.user.userId, djId: dj.user.userId })
    ok(relationship)
    equal((await Listener.findById(listener.user.userId)).followedCount, 1)
    deepEqual(
      deepOmit(await LazyFanCounter.findAll({}), ['lazyFanCounterId']),
      [{ djId: dj.user.userId, change: 1 }]
    )
  })
})
