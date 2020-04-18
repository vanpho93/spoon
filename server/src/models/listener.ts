import { ITimed, ETable, createModel } from './shared'

export interface IListener extends ITimed {
  userId: number
  followedCount: number
}

export class Listener extends createModel<IListener>(ETable.LISTENER, 'userId') {}
