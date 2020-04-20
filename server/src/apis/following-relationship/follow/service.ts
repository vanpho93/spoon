import { isNil } from 'lodash'
import { Dj, IUser, FollowingRelationship, BlockRelationship, Listener } from '../../../global'
import {
  ApiService, AbstractInputGetter, MustBeListenerInputValidator,
  IRequest, AbstractApiExcutor, makeSure, mustExist,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements AbstractInputGetter<IInput> {
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
  private user: IUser
  
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
    await Dj.findByIdAndUpdate(
      this.input.djId,
      {},
      builder => builder.increment('followerCount')
    )
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
