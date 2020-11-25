'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up() {
    this.create('transactions', (table) => {
      table.increments('id')
      table.string('title')
      table.decimal('value', 8, 2)
      table.enum('type', ['income', 'outcome'])
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
