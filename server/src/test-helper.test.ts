import td from 'testdouble'
import { User, Dj, FollowingRelationship, Listener, BlockRelationship, LazyFanCounter, knex } from './global'

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

after(async () => {
  await knex.destroy()
  setTimeout(() => process.exit(0), 1000)
})
