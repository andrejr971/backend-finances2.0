'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTokenSchema extends Schema {
  up() {
    this.create('user_tokens', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('token').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('user_tokens')
  }
}

module.exports = UserTokenSchema
