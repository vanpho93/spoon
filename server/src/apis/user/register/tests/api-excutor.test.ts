import td from 'testdouble'
import bcrypt from 'bcrypt'
import { TestUtils, EAccountType, JWT, deepOmit } from '../../../../global'
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

  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    td.replace(bcrypt, 'hash', () => Promise.resolve('SAMPLE_HASH'))
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))

    const result = await new ApiExcutor().excute(sampleInput)
    deepEqual(
      deepOmit(result, ['userId', 'created', 'modified']),
      {
        email: 'example@gmail.com',
        passwordHash: 'SAMPLE_HASH',
        name: 'First Last',
        token: 'SAMPLE_TOKEN',
      }
    )
  })
})
