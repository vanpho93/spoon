import { isNil } from 'lodash'

// tslint:disable-next-line: no-any
export const exist = (value: any) => {
  return !isNil(value)
}
