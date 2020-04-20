import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/block-relationship/unblock',
  method: EMethod.POST,
  service: new Service(),
}
