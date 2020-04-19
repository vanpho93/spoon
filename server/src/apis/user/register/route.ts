import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/user/login',
  method: EMethod.POST,
  Service,
}
