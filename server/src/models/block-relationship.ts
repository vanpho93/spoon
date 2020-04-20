import { exists } from '../global'
import { ITimed, ETable, createModel } from './shared'

export interface IBlockRelationship extends ITimed {
  blockRelationshipId: number
  blockerId: number
  blockeeId: number
}

export class BlockRelationship extends createModel<IBlockRelationship>(ETable.BLOCK_RELATIONSHIP) {
  public static async isRelationshipBlocked(userId1: number, userId2: number) {
    const blockRelationship = await BlockRelationship.findOne({}, builder => {
      return builder
        .where({ blockerId: userId1, blockeeId: userId2 })
        .orWhere({ blockerId: userId2, blockeeId: userId1 })
    })
    return exists(blockRelationship)
  }
}
