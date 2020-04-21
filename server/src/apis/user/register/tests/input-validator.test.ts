import { TestUtils, User } from '../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EError, IInput } from '../metadata'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput: IInput = {
    email: 'example@gmail.com',
    name: 'First Last',
    password: '12345678',
    isDj: true,
    isListener: false,
  }

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await new InputValidator().validate(sampleInput)
  })

  it(`${TEST_TITLE} Given invalid password, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, password: '123' })
      .catch(error => error)
    equal(error.message, EError.PASSWORD_MUST_BE_LONGER_THAN_8)
  })

  it(`${TEST_TITLE} Given existed email, it should throw an error`, async () => {
    const AN_EXISTED_EMAIL = 'anexistedemail@gmail.com'
    await User.create({ email: AN_EXISTED_EMAIL, name: '' })

    const error = await new InputValidator()
      .validate({ ...sampleInput, email: AN_EXISTED_EMAIL })
      .catch(error => error)
    equal(error.message, EError.EMAIL_EXISTED)
  })
})
