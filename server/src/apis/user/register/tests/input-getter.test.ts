import { TestUtils, IRequest, EAccountType } from '../../../../global'
import { InputGetter } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    const request: IRequest = {
      body: {
        email: ' example@gmail.com  \n',
        name: ' First Last ',
        accountType: ' DJ ',
        password: 'sample',
      },
    }
    deepEqual(
      new InputGetter().getInput(request),
      {
        email: 'example@gmail.com',
        name: 'First Last',
        password: 'sample',
        accountType: EAccountType.DJ,
      }
    )
  })
})
