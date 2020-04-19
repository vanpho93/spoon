import { trim, omit, isNil } from 'lodash'
import { compare } from 'bcrypt'
import { User, JWT, Dj, IUser } from '../../../global'
import {
  ApiService, AbstractInputGetter, AbstractInputValidator,
  IRequest, EAccountType, AbstractApiExcutor, makeSure, mustExist,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements AbstractInputGetter<IInput> {
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
    const accountType = await this.getAccountType()
    const token = await JWT.createToken({ userId: this.user.userId, accountType })
    return { ...omit(this.user, 'passwordHash'), accountType, token }
  }

  private async getAccountType() {
    const dj = await Dj.findById(this.user.userId)
    if (isNil(dj)) return EAccountType.LISTENER
    return EAccountType.DJ
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
