import { IUserContext, UserContext } from './user-context'
import { IRequest } from '.'
import { BaseApiService } from './metadata'
import { makeSure } from './utils'

export interface AbstractInputGetter<T> {
  getInput(req: IRequest): T
}

export abstract class AbstractInputValidator<Input> {
  protected input: Input
  protected userContext: IUserContext

  validate(input: Input, userContext: IUserContext = new UserContext()): Promise<void> {
    this.input = input
    this.userContext = userContext
    return this.check()
  }

  abstract check(): Promise<void>
}

export abstract class AbstractApiExcutor<Input, Output> {
  protected input: Input
  protected userContext: IUserContext

  excute(input: Input, userContext: IUserContext = new UserContext()): Promise<Output> {
    this.input = input
    this.userContext = userContext
    return this.process()
  }

  abstract process(): Promise<Output>
}

export abstract class ApiService<Input = void, Output = void> extends BaseApiService {
  input: Input
  abstract inputGetter: AbstractInputGetter<Input>
  abstract inputValidator: AbstractInputValidator<Input>
  abstract excutor: AbstractApiExcutor<Input, Output>

  public async process(): Promise<Output> {
    this.input = this.inputGetter.getInput(this.req)
    await this.inputValidator.validate(this.input, this.userContext)
    return this.excutor.excute(this.input, this.userContext)
  }
}

export class NullInputGetter implements AbstractInputGetter<null> {
  getInput(_: IRequest): null {
    return null
  }
}

export class SkippedInputValidator extends AbstractInputValidator<null> {
  check(): Promise<void> {
    return
  }
}

export class MustBeUserInputValidator<Input> extends AbstractInputValidator<Input>{
  async check(): Promise<void> {
    makeSure(this.userContext.isUser, 'MUST_BE_USER')
  }
}

export class MustBeListenerInputValidator<Input> extends MustBeUserInputValidator<Input> {
  async check(): Promise<void> {
    await super.check()
    makeSure(this.userContext.isListener, 'MUST_BE_LISTENER')
  }
}

export class MustBeDjInputValidator<Input> extends MustBeUserInputValidator<Input> {
  async check(): Promise<void> {
    await super.check()
    makeSure(this.userContext.isDj, 'MUST_BE_DJ')
  }
}
