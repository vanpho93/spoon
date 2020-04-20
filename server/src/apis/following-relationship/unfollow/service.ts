import { FollowingRelationship, Listener, LazyFanCounter } from '../../../global'
import {
  ApiService, IAbstractInputGetter, MustBeListenerInputValidator,
  IRequest, AbstractApiExcutor, mustExist,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    return { djId: Number(req.body.djId) }
  }
}

export class InputValidator extends MustBeListenerInputValidator<IInput> {
  async check() {
    await super.check()
    const currentRlationship = await FollowingRelationship.findOne({
      listenerId: this.userContext.userId,
      djId: this.input.djId,
    })
    mustExist(currentRlationship, EError.NOT_FOLLOWED)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    await FollowingRelationship.findOneAndDelete({
      listenerId: this.userContext.userId,
      djId: this.input.djId,
    })
    await Listener.findByIdAndUpdate(
      this.userContext.userId,
      {},
      builder => builder.decrement('followedCount')
    )
    await LazyFanCounter.create({
      djId: this.input.djId,
      change: -1,
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
