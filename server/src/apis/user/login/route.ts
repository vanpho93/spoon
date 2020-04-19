import { IRoute, EMethod, ApiService } from '../../shared'

export const route: IRoute = {
  method: EMethod.GET,
  path: '/login',
  Service: class MyApiService extends ApiService {}
}
