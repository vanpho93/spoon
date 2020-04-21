import { IUser, User, Dj, Listener, UserContext, IUserContext } from '../global'

export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }
}

export class TestUserContextBuilder {
  private user: Partial<IUser>

  static create(userInput: Partial<IUser>) {
    return new TestUserContextBuilder().create(userInput)
  }

  create(userInput: Partial<IUser>) {
    const defaultUser = {
      email: 'example@gmail.com',
      name: 'First Last',
      passwordHash: '',
      isListener: false,
      isDj: false,
    }
    this.user = { ...defaultUser, ...userInput }
    return this.save()
  }

  private async save(): Promise<IUserContext> {
    const user = await User.create(this.user)
    if (this.user.isDj) await Dj.create({ userId: user.userId })
    if (this.user.isListener) await Listener.create({ userId: user.userId })
    return new UserContext(user)
  }
}
