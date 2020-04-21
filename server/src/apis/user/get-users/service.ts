import { defaultTo } from 'lodash'
import { User } from '../../../global'
import {
  ApiService, IAbstractInputGetter, IRequest,
  AbstractApiExcutor, SkippedInputValidator,
} from '../../shared'
import { IInput, IOutput } from './metadata'

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
    const fromIndex = (this.input.page - 1) * this.input.pageSize
    return User.findAll({}, builder => {
      return builder
        .limit(this.input.pageSize)
        .offset(fromIndex)
        .orderBy('userId')
        .select(['userId', 'email', 'name', 'isDj', 'isListener'])
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new SkippedInputValidator()
  excutor = new ApiExcutor()
}
