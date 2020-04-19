import { User } from './global'

beforeEach(async () => {
  await User.deleteMany({})
})
