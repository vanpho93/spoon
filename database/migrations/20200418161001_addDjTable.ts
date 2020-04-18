import * as Knex from 'knex'
import { addModified, addCascadeForeignKey, addCreated } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dj', table => {
  addCascadeForeignKey(table, 'user', {})
  table.primary(['user_id'])
  table.integer('follower_count', 10)
  addCreated(table, knex)
})
await addModified('dj', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dj')
}
