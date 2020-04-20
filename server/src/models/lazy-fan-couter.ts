import { ETable, createModel } from './shared'

export interface ILazyFanCounter {
  djId: number
  change: number
}

export class LazyFanCounter extends createModel<ILazyFanCounter>(ETable.LAZY_FAN_COUNTER) {}
