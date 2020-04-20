import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/block-relationship/block',
  method: EMethod.POST,
  service: new Service(),
}
