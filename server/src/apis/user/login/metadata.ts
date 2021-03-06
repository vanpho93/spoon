import { IUser } from '../../../global'

export interface IInput {
  email: string
  password: string
}

export type IOutput = IUser & { token: string }

export enum EError {
  CANNOT_FIND_EMAIL = 'CANNOT_FIND_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}
