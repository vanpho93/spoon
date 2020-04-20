import td from 'testdouble'
import { User, Dj, FollowingRelationship, Listener, BlockRelationship, LazyFanCounter } from './global'

beforeEach(async () => {
  await User.deleteMany({})
  await Dj.deleteMany({})
  await FollowingRelationship.deleteMany({})
  await Listener.deleteMany({})
  await BlockRelationship.deleteMany({})
  await LazyFanCounter.deleteMany({})
})

afterEach(() => {
  td.reset()
})
