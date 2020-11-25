'use strict'

const Category = use('App/Models/Category')

class CategoryController {
  async index({ auth, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const categories = await Category.query().where('user_id', auth.user.id).fetch()

    return categories
  }

  async store({ auth, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const name = request.input('name')

    const category = await Category.create({
      name,
      user_id: auth.user.id,
    })

    return category
  }

  async show({ auth, params, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const category = await Category.query()
      .where('id', params.id)
      .where('user_id', auth.user.id)
      .fetch()

    return category
  }

  async update({ auth, params, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const category = await Category.findOrFail(params.id)

    const name = request.input('name')

    category.name = name

    await category.save()

    return category
  }
}

module.exports = CategoryController
