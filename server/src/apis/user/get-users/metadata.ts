import { IUser, EAccountType } from '../../../global'

export interface IInput {
  pageSize: number
  page: number
}

export type IOutput = (Omit<IUser, 'passwordHash'> & { accountType: EAccountType })[]
