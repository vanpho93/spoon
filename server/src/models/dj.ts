import { ITimed, ETable, createModel } from './shared'

export interface IDj extends ITimed {
  userId: number
  followerCount: number
}

export class Dj extends createModel<IDj>(ETable.DJ, 'userId') {}
