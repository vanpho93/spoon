import { TestUtils, LazyFanCounter, TestUserContextBuilder, Dj } from '../../global'
import { FanCountUpdater } from '../fan-count-updater'
import { deepEqual, equal } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(TEST_TITLE, async () => {
    await TestUserContextBuilder.create({ userId: 1, email: 'doesntmatter1' }).isDj().build()
    await TestUserContextBuilder.create({ userId: 2, email: 'doesntmatter2' }).isDj().build()
    await LazyFanCounter.createMany([
      { lazyFanCounterId: 1, djId: 1, change: 1 },
      { lazyFanCounterId: 2, djId: 2, change: 1 },
      { lazyFanCounterId: 3, djId: 2, change: 1 },
      { lazyFanCounterId: 4, djId: 1, change: -1 },
    ])
  })

  it(`${TEST_TITLE} FanCountUpdater works`, async () => {
    await FanCountUpdater.process()
    const djs = await Dj.findAll({}, builder => builder.select('userId', 'followerCount'))
    deepEqual(
      djs,
      [ { userId: 1, followerCount: 0 }, { userId: 2, followerCount: 2 } ]
    )
    equal(await LazyFanCounter.count({}), 0)
  })
})
