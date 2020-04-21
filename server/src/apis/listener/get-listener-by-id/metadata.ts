import { IUser, IListener } from '../../../global'

export interface IInput {
  listenerId: number
}

export type IOutput = IUser & IListener

export enum EError {
  CANNOT_FIND_LISTENER = 'CANNOT_FIND_LISTENER',
}
