import { TestUtils, TestUserContextBuilder } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await TestUserContextBuilder.create({ userId: 1, email: 'u1-listener@gmail.com', isListener: true })
    await TestUserContextBuilder.create({ userId: 2, email: 'u2-listener@gmail.com', isListener: true })
    await TestUserContextBuilder.create({ userId: 3, email: 'u3-dj@gmail.com', isDj: true })
  })

  it(`${TEST_TITLE} ApiExcutor works with not-followed users`, async () => {
    const response1 = await new ApiExcutor().excute({ page: 1, pageSize: 2 })
    deepEqual(
      response1,
      [
        {
          userId: 1,
          email: 'u1-listener@gmail.com',
          name: 'First Last',
          isListener: true,
          isDj: false,
        },
        {
          userId: 2,
          email: 'u2-listener@gmail.com',
          name: 'First Last',
          isListener: true,
          isDj: false,
        },
      ]
    )

    const response2 = await new ApiExcutor().excute({ page: 2, pageSize: 2 })
    deepEqual(
      response2,
      [
        {
          userId: 3,
          email: 'u3-dj@gmail.com',
          name: 'First Last',
          isListener: false,
          isDj: true,
        },
      ]
    )
  })
})
