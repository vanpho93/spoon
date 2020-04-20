import { IUser, IDj } from '../../../global'

export interface IInput {
  djId: number
}

export type IOutput = Omit<IUser, 'passwordHash'> & IDj

export enum EError {
  CANNOT_FIND_DJ = 'CANNOT_FIND_DJ',
}
