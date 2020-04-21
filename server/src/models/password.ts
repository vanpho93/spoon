import { ITimed, ETable, createModel } from './shared'

export interface IPassword extends ITimed {
  userId: number
  passwordHash: string
}

export class Password extends createModel<IPassword>(ETable.PASSWORD, 'userId') {}
