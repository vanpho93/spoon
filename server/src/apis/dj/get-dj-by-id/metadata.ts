import { IUser, IDj } from '../../../global'

export interface IInput {
  djId: number
}

export type IOutput = IUser & IDj

export enum EError {
  CANNOT_FIND_DJ = 'CANNOT_FIND_DJ',
}
