import { omit } from 'lodash'
import { User, Listener, BlockRelationship } from '../../../global'
import {
  ApiService, AbstractInputGetter, IRequest,
  AbstractApiExcutor, makeSure, mustExist, MustBeUserInputValidator,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements AbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    return { listenerId: Number(req.body.listenerId) }
  }
}

export class InputValidator extends MustBeUserInputValidator<IInput> {
  async check() {
    await super.check()
    const isBlocked = await BlockRelationship.isRelationshipBlocked(
      this.userContext.userId,
      this.input.listenerId
    )
    makeSure(!isBlocked, EError.CANNOT_FIND_LISTENER)

    const listener = await Listener.findById(this.input.listenerId)
    mustExist(listener, EError.CANNOT_FIND_LISTENER)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const user = await User.findById(this.input.listenerId)
    const listener = await Listener.findById(this.input.listenerId)
    return { ...omit(user, 'passwordHash'), ...listener }
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
