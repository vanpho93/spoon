import * as Knex from 'knex'
import { addPrimaryKey, addCascadeForeignKey } from '../tableBuilder'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lazy_fan_counter', table => {
    addPrimaryKey(table, 'lazy_fan_counter_id')

    addCascadeForeignKey(table, 'dj', {
      columnName: 'dj_id',
      foreignKey: 'dj_id_user_id_foreign_key',
      foreignColumnName: 'user_id',
      notNullable: true,
    })
    table.integer('change', 1)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lazy_fan_counter')
}
