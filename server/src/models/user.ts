import { ITimed, ETable, createModel } from './shared'

export interface IUser extends ITimed {
  userId: number
  email: string
  name: string
  passwordHash: string
}

export class User extends createModel<IUser>(ETable.USER) {}
