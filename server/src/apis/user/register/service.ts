import { trim, omit, isNil } from 'lodash'
import { hash } from 'bcrypt'
import { User, JWT, Listener, Dj } from '../../../global'
import {
  ApiService, IAbstractInputGetter, AbstractInputValidator,
  IRequest, EAccountType, AbstractApiExcutor, makeSure, EHttpStatusCode,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const { email, name, password, accountType } = req.body
    return {
      email: trim(email),
      name: trim(name),
      password,
      accountType: trim(accountType) as EAccountType,
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    makeSure(this.input.password.length >= 8, EError.PASSWORD_MUST_BE_LONGER_THAN_8)
    const user = await User.findOne({ email: this.input.email })
    makeSure(isNil(user), EError.EMAIL_EXISTED, EHttpStatusCode.CONFLICT)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    const passwordHash = await hash(this.input.password, 8)
    const user = await User.create({
      email: this.input.email,
      name: this.input.name,
      passwordHash,
    })

    if (this.input.accountType === EAccountType.LISTENER) {
      await Listener.create({ userId: user.userId })
    } else {
      await Dj.create({ userId: user.userId })
    }

    const token = await JWT.createToken({ userId: user.userId, accountType: this.input.accountType })
    return {
      ...omit(user, 'passwordHash'),
      accountType: this.input.accountType,
      token,
    }
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
