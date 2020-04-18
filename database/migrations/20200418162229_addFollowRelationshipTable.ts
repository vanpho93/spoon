import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('following_relationship', table => {
    addPrimaryKey(table, 'following_relationship_id')

    addCascadeForeignKey(table, 'user', {
      columnName: 'follower_id',
      notNullable: true,
    })
    addCascadeForeignKey(table, 'dj', {
      columnName: 'dj_id',
      foreignColumnName: 'user_id',
      notNullable: true,
    })
    table.unique(['follower_id', 'dj_id'])

    addCreated(table, knex)
  })
  await addModified('following_relationship', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('following_relationship')
}
