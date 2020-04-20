import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/following-relationship/unfollow',
  method: EMethod.POST,
  service: new Service(),
}
