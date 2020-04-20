import { isNil } from 'lodash'
import { Dj, FollowingRelationship, BlockRelationship, Listener, LazyFanCounter } from '../../../global'
import {
  ApiService, IAbstractInputGetter, MustBeListenerInputValidator,
  IRequest, AbstractApiExcutor, makeSure, mustExist,
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
    const isBlocked = await BlockRelationship.isRelationshipBlocked(
      this.userContext.userId,
      this.input.djId
    )
    makeSure(!isBlocked, EError.CANNOT_FIND_DJ)

    const dj = await Dj.findById(this.input.djId)
    mustExist(dj, EError.CANNOT_FIND_DJ)

    const currentRlationship = await FollowingRelationship.findOne({
      listenerId: this.userContext.userId,
      djId: this.input.djId,
    })
    makeSure(isNil(currentRlationship), EError.ALREADY_FOLLOWED)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    await FollowingRelationship.create({
      listenerId: this.userContext.userId,
      djId: this.input.djId,
    })
    await Listener.findByIdAndUpdate(
      this.userContext.userId,
      {},
      builder => builder.increment('followedCount')
    )
    await LazyFanCounter.create({
      djId: this.input.djId,
      change: 1,
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
