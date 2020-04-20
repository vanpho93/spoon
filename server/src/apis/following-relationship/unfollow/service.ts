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
    const currentRlationship = await FollowingRelationship.findOne({
      followerId: this.userContext.userId,
      djId: this.input.djId,
    })
    mustExist(currentRlationship, EError.NOT_FOLLOWED)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  private user: IUser
  
  async process() {
    await FollowingRelationship.findOneAndDelete({
      followerId: this.userContext.userId,
      djId: this.input.djId,
    })
    await Listener.findByIdAndUpdate(
      this.userContext.userId,
      {},
      builder => builder.decrement('followedCount')
    )
    await Dj.findByIdAndUpdate(
      this.input.djId,
      {},
      builder => builder.decrement('followerCount')
    )
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
