import { IUser, EAccountType } from '../../../global'

export interface IInput {
  email: string
  password: string
}

export type IOutput = Omit<IUser, 'passwordHash'> & { token: string, accountType: EAccountType }

export enum EError {
  CANNOT_FIND_EMAIL = 'CANNOT_FIND_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}
