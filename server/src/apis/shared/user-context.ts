import { Request } from 'express'
import { isNil } from 'lodash'
import { exists, JWT } from '../../global'

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
  public static async getUserContext(req: Request): Promise<IUserContext> {
    const { token } = req.headers as { [key: string]: string }
    if (isNil(token)) return new UserContext()

    const { userId, accountType } = await JWT.verifyToken<{ userId: number, accountType: EAccountType }>(token)
    return new UserContext(userId, accountType)
  }
}
