export interface IInput {
  userId: number
}

export type IOutput = void

export enum EError {
  ALREADY_BLOCKED = 'ALREADY_BLOCKED',
  CANNOT_FIND_USER = 'CANNOT_FIND_USER',
}
