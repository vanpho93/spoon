export interface ITimed {
  created: Date
  modified: Date
}

export enum ETable {
  USER = 'user',
  LISTENER = 'listener',
  DJ = 'dj',
  FOLLOWING_RELATIONSHIP = 'following_relationship',
  BLOCK_RELATIONSHIP = 'block_relationship',
  LAZY_FAN_COUNTER = 'lazy_fan_counter',
  PASSWORD = 'password',
}
