import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/following-relationship/follow',
  method: EMethod.POST,
  service: new Service(),
}
