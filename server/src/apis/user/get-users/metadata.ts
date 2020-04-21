import { IUser } from '../../../global'

export interface IInput {
  pageSize: number
  page: number
}

export type IOutput = Omit<IUser, 'passwordHash'>[]
