import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/follower',
  method: EMethod.GET,
  service: new Service(),
}
