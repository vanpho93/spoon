import * as Knex from 'knex'
import { addModified, addCascadeForeignKey, addCreated } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('listener', table => {
  addCascadeForeignKey(table, 'user', {})
  table.primary(['user_id'])
  table.integer('followed_count', 10).defaultTo(0)
  addCreated(table, knex)
})
await addModified('listener', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('listener')
}
