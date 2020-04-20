import { isNil } from 'lodash'
import { exists, JWT, IRequest } from '../../global'

export enum EAccountType {
  LISTENER = 'LISTENER',
  DJ = 'DJ',
}

export interface IUserContext {
  readonly isUser: boolean
  readonly isListener: boolean
  readonly isDj: boolean
  readonly userId?: number
}

export class UserContext implements IUserContext {
  constructor(public userId: number = undefined, private accountType: EAccountType = undefined) {}

  get isUser() { return exists(this.userId) }

  get isListener() { return this.accountType === EAccountType.LISTENER }

  get isDj() { return this.accountType === EAccountType.DJ }
}

export class UserContextManager {
  public static async getUserContext(req: IRequest): Promise<IUserContext> {
    const { token } = req.headers
    if (isNil(token)) return new UserContext()

    try {
      const { userId, accountType } = await JWT.verifyToken<{ userId: number, accountType: EAccountType }>(token)
      return new UserContext(userId, accountType)
    } catch (error) {
      return new UserContext()
    }
  }
}
