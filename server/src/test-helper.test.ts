import td from 'testdouble'
import { User } from './global'

beforeEach(async () => {
  await User.deleteMany({})
})

afterEach(() => {
  td.reset()
})
