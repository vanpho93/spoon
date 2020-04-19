import td from 'testdouble'
import { TestUtils, JWT, deepOmit, User, Dj, Listener, IUser, EAccountType } from '../../../../global'
import { ApiExcutor } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  let listener: IUser
  let dj: IUser

  beforeEach(async () => {
    [listener, dj] = await User.createMany([
      { email: 'listener@gmail.com', name: 'First Listener', passwordHash: '' },
      { email: 'dj@gmail.com', name: 'First Dj', passwordHash: '' },
    ])
    await Dj.create({ userId: dj.userId })
    await Listener.create({ userId: listener.userId })
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can login with DJ account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'dj@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified']),
      {
        userId: dj.userId,
        email: 'dj@gmail.com',
        name: 'First Dj',
        token: 'SAMPLE_TOKEN',
        accountType: EAccountType.DJ,
      }
    )
  })

  it(`${TEST_TITLE} Can login with LISTENER account`, async () => {
    const result = await new ApiExcutor().excute({ email: 'listener@gmail.com', password: 'doesnt-matter' })
    deepEqual(
      deepOmit(result, ['created', 'modified']),
      {
        userId: listener.userId,
        email: 'listener@gmail.com',
        name: 'First Listener',
        accountType: EAccountType.LISTENER,
        token: 'SAMPLE_TOKEN',
      }
    )
  })
})
