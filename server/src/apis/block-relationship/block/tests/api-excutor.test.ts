import {
  TestUtils, FollowingRelationship, TestUserContextBuilder, IUserContext,
  BlockRelationship, Listener, LazyFanCounter, deepOmit,
} from '../../../../global'
import { ApiExcutor } from '../service'
import { ok, equal, deepEqual } from 'assert'
import { isNil } from 'lodash'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUserContext
  let dj: IUserContext

  beforeEach(async () => {
    listener = await TestUserContextBuilder.create({ email: 'listener@gmail.com', isListener: true })
    dj = await TestUserContextBuilder.create({ email: 'dj@gmail.com', isDj: true })
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    await new ApiExcutor().excute({ userId: dj.user.userId }, listener)
    const relationship = await BlockRelationship.findOne({ blockerId: listener.user.userId, blockeeId: dj.user.userId })
    ok(relationship)
  })

  it(`${TEST_TITLE} ApiExcutor works with follower block dj`, async () => {
    await FollowingRelationship.create({
      listenerId: listener.user.userId,
      djId: dj.user.userId,
    })

    await new ApiExcutor().excute({ userId: dj.user.userId }, listener)
    equal((await Listener.findById(listener.user.userId)).followedCount, -1)
    deepEqual(
      deepOmit(await LazyFanCounter.findAll({}), ['lazyFanCounterId']),
      [{ djId: dj.user.userId, change: -1 }]
    )

    const relationship = await FollowingRelationship.findOne({
      listenerId: listener.user.userId,
      djId: dj.user.userId,
    })
    ok(isNil(relationship))
  })

  it(`${TEST_TITLE} ApiExcutor works with dj block follower`, async () => {
    await FollowingRelationship.create({
      listenerId: listener.user.userId,
      djId: dj.user.userId,
    })

    await new ApiExcutor().excute({ userId: listener.user.userId }, dj)

    equal((await Listener.findById(listener.user.userId)).followedCount, -1)
    deepEqual(
      deepOmit(await LazyFanCounter.findAll({}), ['lazyFanCounterId']),
      [{ djId: dj.user.userId, change: -1 }]
    )

    const relationship = await FollowingRelationship.findOne({
      listenerId: listener.user.userId,
      djId: dj.user.userId,
    })
    ok(isNil(relationship))
  })
})
