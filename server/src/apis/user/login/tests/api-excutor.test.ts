import td from 'testdouble'
import { TestUtils, JWT, deepOmit, IUserContext, EAccountType, TestUserContextBuilder } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

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

    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can login with DJ account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'dj@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified', 'name']),
      {
        userId: dj.userId,
        email: 'dj@gmail.com',
        token: 'SAMPLE_TOKEN',
        accountType: EAccountType.DJ,
      }
    )
  })

  it(`${TEST_TITLE} Can login with LISTENER account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'listener@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified', 'name']),
      {
        userId: listener.userId,
        email: 'listener@gmail.com',
        accountType: EAccountType.LISTENER,
        token: 'SAMPLE_TOKEN',
      }
    )
  })
})
