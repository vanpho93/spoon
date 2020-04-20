import { IRoute, EMethod } from '../../../apis/shared'
import { Service } from './service'

export const route: IRoute = {
  path: '/listener/:listenerId',
  method: EMethod.POST,
  service: new Service(),
}
