import { Dj, FollowingRelationship, BlockRelationship, Listener, User, LazyFanCounter } from '../../../global'
import {
  ApiService, AbstractInputGetter, IRequest, AbstractApiExcutor,
  makeSure, mustExist, MustBeUserInputValidator,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements AbstractInputGetter<IInput> {
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
    makeSure(!isBlocked, EError.ALREADY_BLOCKED)

    const blockee = await User.findById(this.input.userId)
    mustExist(blockee, EError.CANNOT_FIND_USER)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    await BlockRelationship.create({
      blockerId: this.userContext.userId,
      blockeeId: this.input.userId,
    })
    await this.unfollow()
  }

  private async unfollow() {
    if (this.userContext.isDj) return await this.unfollowByIds(this.input.userId, this.userContext.userId)
    await this.unfollowByIds(this.userContext.userId, this.input.userId)
  }

  private async unfollowByIds(listenerId: number, djId: number) {
    const isFollowing = await FollowingRelationship.findOneAndDelete({ listenerId, djId })
    if (!isFollowing) return
    await Listener.findByIdAndUpdate(listenerId, {}, builder => builder.decrement('followedCount'))
    await LazyFanCounter.create({
      djId,
      change: -1,
    })
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
