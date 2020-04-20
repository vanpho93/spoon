import { groupBy, map, reduce } from 'lodash'
import { LazyFanCounter, knex, ETable, ILazyFanCounter } from '../global'
import { OneAtATime } from './one-at-a-time'

export class FanCountUpdater extends OneAtATime {
  protected static async doWhenAvailable() {
    const counters = await LazyFanCounter.findAll({})

    const summedChangesCounters = map(
      groupBy(counters, counter => counter.djId),
      counters => reduce(counters, (a, b) => ({ ...a, change: a.change + b.change }))
    )

    const sql = map(summedChangesCounters, counter => this.getSql(counter)).join(';\n')
    await knex.raw(sql)

    await LazyFanCounter.deleteMany({}, builder => {
      return builder.whereIn('lazyFanCounterId', map(counters, 'lazyFanCounterId'))
    })
  }

  private static getSql(counter: ILazyFanCounter) {
    return knex(ETable.DJ)
      .where({ userId: counter.djId })
      .increment('followerCount', counter.change)
      .toString()
  }
}
