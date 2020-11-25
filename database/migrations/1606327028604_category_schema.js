'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up() {
    this.create('categories', (table) => {
      table.increments('id')
      table.string('name')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('categories')
  }
}

module.exports = CategorySchema
