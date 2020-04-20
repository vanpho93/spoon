import { IUser, User, EAccountType, Dj, Listener, UserContext, IUserContext } from '../global'

export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }
}

export class TestUserContextBuilder {
  private user: Partial<IUser>
  private accountType: EAccountType

  static create(userInput: Partial<IUser>) {
    return new TestUserContextBuilder().create(userInput)
  }

  create(userInput: Partial<IUser>) {
    const defaultUser = {
      email: 'example@gmail.com',
      name: 'First Last',
      passwordHash: '',
    }
    this.user = { ...defaultUser, ...userInput }
    return this
  }

  isDj() {
    return this.setAccountType(EAccountType.DJ)
  }

  isListener() {
    return this.setAccountType(EAccountType.LISTENER)
  }

  private setAccountType(accountType: EAccountType) {
    this.accountType = accountType
    return this
  }

  async build(): Promise<IUserContext> {
    const user = await User.create(this.user)
    if (this.accountType === EAccountType.DJ) await Dj.create({ userId: user.userId })
    if (this.accountType === EAccountType.LISTENER) await Listener.create({ userId: user.userId })
    return new UserContext(user.userId, this.accountType)
  }
}
