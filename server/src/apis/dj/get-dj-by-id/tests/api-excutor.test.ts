import { TestUtils, TestUserContextBuilder, IUserContext } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'
import { omit } from 'lodash'

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
    const response = await new ApiExcutor().excute({ djId: dj.userId }, listener)
    deepEqual(
      omit(response, ['created', 'modified', 'userId', 'name']),
      { email: 'dj@gmail.com', followerCount: 0 }
    )
  })
})
