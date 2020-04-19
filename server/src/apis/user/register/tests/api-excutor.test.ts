import td from 'testdouble'
import bcrypt from 'bcrypt'
import { TestUtils, EAccountType, JWT, deepOmit, User, Dj, Listener } from '../../../../global'
import { ApiExcutor } from '../service'
import { IInput } from '../metadata'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput: IInput = {
    email: 'example@gmail.com',
    name: 'First Last',
    password: '12345678',
    accountType: EAccountType.DJ,
  }

  beforeEach(TEST_TITLE, () => {
    td.replace(bcrypt, 'hash', () => Promise.resolve('SAMPLE_HASH'))
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can create DJ account`, async () => {
    const result = await new ApiExcutor().excute(sampleInput)
    deepEqual(
      deepOmit(result, ['userId', 'created', 'modified']),
      {
        email: 'example@gmail.com',
        passwordHash: 'SAMPLE_HASH',
        name: 'First Last',
        accountType: EAccountType.DJ,
        token: 'SAMPLE_TOKEN',
      }
    )

    const user = await User.findOne({ email: 'example@gmail.com' })
    deepEqual(
      deepOmit(user, ['userId', 'created', 'modified']),
      {
        email: 'example@gmail.com',
        passwordHash: 'SAMPLE_HASH',
        name: 'First Last',
      }
    )

    const dj = await Dj.findById(user.userId, builder => builder.select(['userId', 'followerCount']))
    deepEqual(dj, { userId: user.userId, followerCount: 0 })
  })

  it(`${TEST_TITLE} Can create LISTENER account`, async () => {
    const result = await new ApiExcutor().excute({ ...sampleInput, accountType: EAccountType.LISTENER })
    const listener = await Listener.findById(result.userId, builder => builder.select(['userId', 'followedCount']))
    deepEqual(listener, { userId: result.userId, followedCount: 0 })
  })
})
