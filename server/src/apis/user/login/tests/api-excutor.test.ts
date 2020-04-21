import td from 'testdouble'
import { TestUtils, JWT, deepOmit, IUserContext, TestUserContextBuilder } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUserContext
  let dj: IUserContext

  beforeEach(async () => {
    listener = await TestUserContextBuilder.create({ email: 'listener@gmail.com', isListener: true })
    dj = await TestUserContextBuilder.create({ email: 'dj@gmail.com', isDj: true })
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can login with DJ account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'dj@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified', 'name']),
      {
        userId: dj.user.userId,
        email: 'dj@gmail.com',
        token: 'SAMPLE_TOKEN',
        isDj: true,
        isListener: false,
      }
    )
  })

  it(`${TEST_TITLE} Can login with LISTENER account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'listener@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified', 'name']),
      {
        userId: listener.user.userId,
        email: 'listener@gmail.com',
        isDj: false,
        isListener: true,
        token: 'SAMPLE_TOKEN',
      }
    )
  })
})
