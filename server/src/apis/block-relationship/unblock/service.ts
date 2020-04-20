import { BlockRelationship } from '../../../global'
import {
  ApiService, IAbstractInputGetter, IRequest, AbstractApiExcutor,
  makeSure, MustBeUserInputValidator,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    return { userId: Number(req.body.userId) }
  }
}

export class InputValidator extends MustBeUserInputValidator<IInput> {
  async check() {
    await super.check()
    const isBlocked = await BlockRelationship.isRelationshipBlocked(
      this.userContext.userId,
      this.input.userId
    )
    makeSure(isBlocked, EError.NOT_BLOCKED)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    await BlockRelationship.findOneAndDelete({
      blockerId: this.userContext.userId,
      blockeeId: this.input.userId,
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
