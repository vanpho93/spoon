export interface IInput {
  djId: number
}

export type IOutput = void

export enum EError {
  CANNOT_FIND_DJ = 'CANNOT_FIND_DJ',
  ALREADY_FOLLOWED = 'ALREADY_FOLLOWED',
}
