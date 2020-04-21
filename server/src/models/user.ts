import { ITimed, ETable, createModel } from './shared'

export interface IUser extends ITimed {
  userId: number
  email: string
  name: string
  isDj: boolean
  isListener: boolean
}

export class User extends createModel<IUser>(ETable.USER) {}
