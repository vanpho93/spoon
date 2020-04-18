import * as Knex from 'knex'
import { addPrimaryKey, addCreated, addModified, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('block_relationship', table => {
    addPrimaryKey(table, 'block_relationship_id')

    addCascadeForeignKey(table, 'user', {
      columnName: 'blocker_id',
      foreignKey: 'blocker_id_user_id_foreign_key',
      notNullable: true,
    })
    addCascadeForeignKey(table, 'user', {
      columnName: 'blockee_id',
      foreignKey: 'blockee_id_user_id_foreign_key',
      notNullable: true,
    })
    table.unique(['blocker_id', 'blockee_id'])

    addCreated(table, knex)
  })
  await addModified('block_relationship', knex)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('block_relationship')
}
