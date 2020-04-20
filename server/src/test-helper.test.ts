import td from 'testdouble'
import { User, Dj, FollowingRelationship, Listener, BlockRelationship } from './global'

beforeEach(async () => {
  await User.deleteMany({})
  await Dj.deleteMany({})
  await FollowingRelationship.deleteMany({})
  await Listener.deleteMany({})
  await BlockRelationship.deleteMany({})
})

afterEach(() => {
  td.reset()
})
