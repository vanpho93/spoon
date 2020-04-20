import { TestUtils, FollowingRelationship, TestUserContextBuilder, IUserContext, BlockRelationship, Dj, Listener } from '../../../../global'
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
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    await new ApiExcutor().excute({ userId: dj.userId }, listener)
    const relationship = await BlockRelationship.findOne({ blockerId: listener.userId, blockeeId: dj.userId })
    ok(relationship)
  })

  it(`${TEST_TITLE} ApiExcutor works with follower block dj`, async () => {
    await FollowingRelationship.create({
      followerId: listener.userId,
      djId: dj.userId,
    })
    
    await new ApiExcutor().excute({ userId: dj.userId }, listener)
    equal((await Dj.findById(dj.userId)).followerCount, -1)
    equal((await Listener.findById(listener.userId)).followedCount, -1)
    
    const relationship = await FollowingRelationship.findOne({
      followerId: listener.userId,
      djId: dj.userId,
    })
    ok(isNil(relationship))
  })

  it(`${TEST_TITLE} ApiExcutor works with dj block follower`, async () => {
    await FollowingRelationship.create({
      followerId: listener.userId,
      djId: dj.userId,
    })
    
    await new ApiExcutor().excute({ userId: listener.userId }, dj)
    equal((await Dj.findById(dj.userId)).followerCount, -1)
    equal((await Listener.findById(listener.userId)).followedCount, -1)
    
    const relationship = await FollowingRelationship.findOne({
      followerId: listener.userId,
      djId: dj.userId,
    })
    ok(isNil(relationship))
  })
})