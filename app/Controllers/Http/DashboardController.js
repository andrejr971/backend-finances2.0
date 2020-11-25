'use strict'

const Transaction = use('App/Models/Transaction')

class DashboardController {
  async getBalance(transactions) {
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value)
            break
          case 'outcome':
            accumulator.outcome += Number(transaction.value)
            break
          default:
            break
        }

        return accumulator
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      }
    )

    const total = income - outcome

    return {
      income,
      outcome,
      total,
    }
  }

  async index({ auth, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const transactions = await Transaction.query().where('user_id', auth.user.id).fetch()

    const balance = this.getBalance(transactions.toJSON())

    return balance
  }
}

module.exports = DashboardController
