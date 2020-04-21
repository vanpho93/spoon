import { isNil } from 'lodash'
import { exists, JWT, IRequest, IUser, User } from '../../global'

export interface IUserContext {
  readonly isUser: boolean
  readonly user: IUser
}

export class UserContext implements IUserContext {
  constructor(public readonly user: IUser = null) {}

  get isUser() { return exists(this.user) }
}

export class UserContextManager {
  public static async getUserContext(req: IRequest): Promise<IUserContext> {
    const { token } = req.headers
    if (isNil(token)) return new UserContext()

    try {
      const { userId } = await JWT.verifyToken<{ userId: number }>(token)
      const user = await User.findById(userId)
      return new UserContext(user)
    } catch (error) {
      return new UserContext()
    }
  }
}
