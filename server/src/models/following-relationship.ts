import { ITimed, ETable, createModel } from './shared'

export interface IFollowingRelationship extends ITimed {
  followingRelationshipId: number
  listenerId: number
  djId: number
}

export class FollowingRelationship extends createModel<IFollowingRelationship>(ETable.FOLLOWING_RELATIONSHIP) {}
