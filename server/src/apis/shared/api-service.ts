import { IUserContext, UserContext } from './user-context'
import { IRequest } from '.'

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

export abstract class ApiService<Input = void, Output = void> {
  input: Input
  abstract inputGetter: AbstractInputGetter<Input>
  abstract inputValidator: AbstractInputValidator<Input>
  abstract excutor: AbstractApiExcutor<Input, Output>

  constructor(private req: IRequest, public userContext: IUserContext) {}

  public async process(): Promise<Output> {
    this.input = this.inputGetter.getInput(this.req)
    await this.inputValidator.validate(this.input, this.userContext)
    return this.excutor.excute(this.input, this.userContext)
  }
}
