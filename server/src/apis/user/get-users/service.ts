import { User, Dj } from '../../../global'
import {
  ApiService, IAbstractInputGetter, IRequest,
  AbstractApiExcutor, SkippedInputValidator, EAccountType,
} from '../../shared'
import { IInput, IOutput } from './metadata'
import { defaultTo, map, find } from 'lodash'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const DEFAULT_PAGE_SIZE = 10
    const DEFAULT_PAGE = 1
    return {
      pageSize: Number(defaultTo(req.query.pageSize, DEFAULT_PAGE_SIZE)),
      page: Number(defaultTo(req.query.page, DEFAULT_PAGE)),
    }
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {

    const users = await this.getUsers()
    const djs = await Dj.findAll({}, builder => {
      return builder.whereIn('userId', map(users, 'userId')).select('userId')
    })
    return users.map(user => {
      const isDj = find(djs, { userId: user.userId })
      return { ...user, accountType: isDj ? EAccountType.DJ : EAccountType.LISTENER }
    })
  }

  private getUsers() {
    const fromIndex = (this.input.page - 1) * this.input.pageSize
    return User.findAll({}, builder => {
      return builder
        .limit(this.input.pageSize)
        .offset(fromIndex)
        .orderBy('userId')
        .select(['userId', 'email', 'name'])
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new SkippedInputValidator()
  excutor = new ApiExcutor()
}
