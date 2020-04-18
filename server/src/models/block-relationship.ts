import { ITimed, ETable, createModel } from './shared'

export interface IBlockRelationship extends ITimed {
  blockRelationshipId: number
  blockerId: number
  blockeeId: number
}

export class BlockRelationship extends createModel<IBlockRelationship>(ETable.BLOCK_RELATIONSHIP) {}
