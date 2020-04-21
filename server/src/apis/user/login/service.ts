import { trim, omit } from 'lodash'
import { compare } from 'bcrypt'
import { User, JWT, IUser } from '../../../global'
import {
  ApiService, IAbstractInputGetter, AbstractInputValidator,
  IRequest, AbstractApiExcutor, makeSure, mustExist,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const { email, password } = req.body
    return {
      email: trim(email),
      password,
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    const user = await User.findOne({ email: this.input.email })
    mustExist(user, EError.CANNOT_FIND_EMAIL)

    makeSure(
      await compare(this.input.password, user.passwordHash),
      EError.INVALID_PASSWORD
    )
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  private user: IUser

  async process() {
    this.user = await User.findOne({ email: this.input.email })
    const token = await JWT.createToken({ userId: this.user.userId })
    return { ...omit(this.user, 'passwordHash'), token }
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
