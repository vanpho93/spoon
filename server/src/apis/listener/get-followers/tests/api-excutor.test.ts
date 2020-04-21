import { TestUtils, TestUserContextBuilder, IUserContext, FollowingRelationship, deepOmit } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let dj: IUserContext

  beforeEach(async () => {
    await TestUserContextBuilder.create({ userId: 1, email: 'u1-listener@gmail.com', isListener: true })
    await TestUserContextBuilder.create({ userId: 2, email: 'u2-listener@gmail.com', isListener: true })
    await TestUserContextBuilder.create({ userId: 3, email: 'u3-listener@gmail.com', isListener: true })
    await TestUserContextBuilder.create({ userId: 4, email: 'u4-listener@gmail.com', isListener: true })

    dj = await TestUserContextBuilder.create({ userId: 5, email: 'u5-dj@gmail.com', isDj: true })

    await FollowingRelationship.createMany([
      { djId: dj.user.userId, listenerId: 1 },
      { djId: dj.user.userId, listenerId: 2 },
      { djId: dj.user.userId, listenerId: 3 },
    ])
  })

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    const response1 = await new ApiExcutor().excute({ page: 1, pageSize: 2 }, dj)
    deepEqual(
      deepOmit(response1, ['created', 'modified']),
      [
        {
          userId: 1,
          email: 'u1-listener@gmail.com',
          name: 'First Last',
          isDj: false,
          isListener: true,
        },
        {
          userId: 2,
          email: 'u2-listener@gmail.com',
          name: 'First Last',
          isDj: false,
          isListener: true,
        },
      ]
    )

    const response2 = await new ApiExcutor().excute({ page: 2, pageSize: 2 }, dj)
    deepEqual(
      deepOmit(response2, ['created', 'modified']),
      [
        {
          userId: 3,
          email: 'u3-listener@gmail.com',
          name: 'First Last',
          isDj: false,
          isListener: true,
        },
      ]
    )
  })
})
