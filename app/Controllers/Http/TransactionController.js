'use strict'

const Category = use('App/Models/Category')
const Transaction = use('App/Models/Transaction')

class TransactionController {
  async index({ auth, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const { page } = request.get()

    const month = new Date().getMonth()
    const year = new Date().getFullYear()

    const transactions = await Transaction.query()
      .where('user_id', auth.user.id)
      .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month + 1])
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
      .with('category')
      .orderBy('created_at', 'desc')
      .paginate(page || 1, 6)

    return transactions
  }

  async store({ auth, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const data = request.only(['title', 'value', 'type', 'category'])

    // const validatorSchema = schema.create({
    //   title: schema.string({}, [rules.required()]),
    //   value: schema.number([rules.required()]),
    //   type: schema.string({}, [rules.required()]),
    //   category: schema.string({}, [rules.required()]),
    // })

    // await validator.validate({
    //   schema: validatorSchema,
    //   data,
    // })

    const { category, title, type, value } = data

    let existCategory = await Category.findBy('name', category)

    if (!existCategory) {
      existCategory = await Category.create({
        name: category,
        user_id: auth.user.id,
      })
    }

    const transaction = await Transaction.create({
      title,
      type,
      value,
      user_id: auth.user.id,
      category_id: existCategory.id,
    })

    await transaction.load('category')

    return transaction
  }

  async show({ auth, params, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transaction = await Transaction.findOrFail(params.id)

    await transaction.load('category')

    return transaction
  }

  async update({ auth, params, request, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transaction = await Transaction.findOrFail(params.id)

    const data = request.only(['title', 'value', 'type', 'category'])

    let existCategory = await Category.findBy('name', data.category)

    if (!existCategory) {
      existCategory = await Category.create({
        name: data.category,
        user_id: auth.user.id,
      })
    }

    delete data.category

    transaction.merge({ ...data, category_id: existCategory.id })

    await transaction.save()

    await transaction.load('category')

    return transaction
  }

  async destroy({ params }) {
    const transaction = await Transaction.findOrFail(params.id)

    await transaction.delete()
  }
}

module.exports = TransactionController
