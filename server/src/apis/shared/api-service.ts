import { IUserContext, UserContext } from './user-context'
import { IRequest } from '.'
import { BaseApiService } from './metadata'

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

export class SkippedInputValidator extends AbstractInputValidator<any> {
  check(): Promise<void> {
    return
  }
}
