import { User, FollowingRelationship } from '../../../global'
import {
  ApiService, IAbstractInputGetter, IRequest,
  AbstractApiExcutor, MustBeDjInputValidator,
} from '../../shared'
import { IInput, IOutput } from './metadata'
import { defaultTo, map } from 'lodash'

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
    const followingRelationships = await this.getFollowingRelationships()
    const userIds = map(followingRelationships, 'listenerId')
    return User.findAll({}, builder => {
      return builder
        .whereIn('userId', userIds)
        .select(['userId', 'name', 'email'])
    })
  }

  private getFollowingRelationships() {
    const fromIndex = (this.input.page - 1) * this.input.pageSize
    return FollowingRelationship.findAll({ djId: this.userContext.userId }, builder => {
      return builder
        .limit(this.input.pageSize)
        .offset(fromIndex)
        .orderBy('followingRelationshipId')
        .select('listenerId')
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new MustBeDjInputValidator<IInput>()
  excutor = new ApiExcutor()
}
