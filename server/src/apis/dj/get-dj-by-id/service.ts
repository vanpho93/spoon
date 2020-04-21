import { omit } from 'lodash'
import { User, Dj, BlockRelationship } from '../../../global'
import {
  ApiService, IAbstractInputGetter, IRequest,
  AbstractApiExcutor, MustBeUserInputValidator, makeSure, mustExist,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    return { djId: Number(req.params.djId) }
  }
}

export class InputValidator extends MustBeUserInputValidator<IInput> {
  async check() {
    await super.check()
    const isBlocked = await BlockRelationship.isRelationshipBlocked(
      this.userContext.user.userId,
      this.input.djId
    )
    makeSure(!isBlocked, EError.CANNOT_FIND_DJ)

    const dj = await Dj.findById(this.input.djId)
    mustExist(dj, EError.CANNOT_FIND_DJ)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const user = await User.findById(this.input.djId)
    const dj = await Dj.findById(this.input.djId)
    return { ...omit(user, 'passwordHash'), ...dj }
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
