import { hashSync } from 'bcrypt'
import { TestUtils, User } from '../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EError, IInput } from '../metadata'


const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput = {
    email: 'example@gmail.com',
    password: '12345678',
  }

  beforeEach(async () => {
    await User.create({
      email: sampleInput.email,
      passwordHash: hashSync(sampleInput.password, 8),
      name: 'First Last',
    })
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await new InputValidator().validate(sampleInput)
  })

  it(`${TEST_TITLE} Given non existed email, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, email: 'nonexisted@gmail.com' })
      .catch(error => error)
    equal(error.message, EError.CANNOT_FIND_EMAIL)
  })

  it(`${TEST_TITLE} Given invalid password email, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, password: 'invalid-password' })
      .catch(error => error)
    equal(error.message, EError.INVALID_PASSWORD)
  })
})
