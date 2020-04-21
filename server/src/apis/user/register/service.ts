import { trim, isNil } from 'lodash'
import { hash } from 'bcrypt'
import { User, JWT, Listener, Dj, Password } from '../../../global'
import {
  ApiService, IAbstractInputGetter, AbstractInputValidator,
  IRequest, AbstractApiExcutor, makeSure, EHttpStatusCode,
} from '../../shared'
import { IInput, IOutput, EError } from './metadata'

export class InputGetter implements IAbstractInputGetter<IInput> {
  getInput(req: IRequest): IInput {
    const { email, name, password, isDj, isListener } = req.body
    return {
      email: trim(email),
      name: trim(name),
      password,
      isDj: Boolean(isDj),
      isListener: Boolean(isListener),
    }
  }
}

export class InputValidator extends AbstractInputValidator<IInput> {
  async check() {
    makeSure (this.input.password.length >= 8, EError.PASSWORD_MUST_BE_LONGER_THAN_8)
     const user = await User.findOne({ email: this.input.email })
    makeSure(isNil(user), EError.EMAIL_EXISTED, EHttpStatusCode.CONFLICT)
  }
}

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process() {
    const user = await User.create({
      email: this.input.email,
      name: this.input.name,
      isDj: this.input.isDj,
      isListener: this.input.isListener,
    })
    const passwordHash = await hash(this.input.password, 8)
    await Password.create({ userId: user.userId, passwordHash })

    if (this.input.isListener) await Listener.create({ userId: user.userId })
    if (this.input.isDj)  await Dj.create({ userId: user.userId })

    const token = await JWT.createToken({ userId: user.userId })
    return {
      ...user,
      token,
    }
  }
}

export class Service extends ApiService<IInput, IOutput> {
  inputGetter = new InputGetter()
  inputValidator = new InputValidator()
  excutor = new ApiExcutor()
}
