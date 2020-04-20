import { TestUtils } from '../../../../global'
import { InputGetter } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    deepEqual(
      new InputGetter().getInput({ params: { listenerId: ' 1' } }),
      { listenerId: 1 },
    )
  })
})
