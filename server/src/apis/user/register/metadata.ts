import { IUser } from '../../../global'

export interface IInput {
  email: string
  name: string
  password: string
  isDj: boolean
  isListener: boolean
}

export type IOutput = IUser & { token: string }

export enum EError {
  EMAIL_EXISTED = 'EMAIL_EXISTED',
  PASSWORD_MUST_BE_LONGER_THAN_8 = 'PASSWORD_MUST_BE_LONGER_THAN_8',
}
