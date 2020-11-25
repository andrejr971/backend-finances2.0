'use strict'

const Transaction = use('App/Models/Transaction')
const { format } = require('date-fns')

class ChartController {
  async convertData({ userId, year, type }) {
    const labels = []
    const data = []
    const datasets = []

    // for (const transaction of transactions) {
    //   const month = format(new Date(`${transaction.month}`), 'MMM')
    //   data.push(Number(transaction.total))
    //   labels.push(month)
    // }

    const month = new Date().getMonth() + 1

    for (let index = 1; index <= month; index++) {
      const transaction = await Transaction.query()
        .where('user_id', userId)
        .where('type', type)
        .sum('value')
        .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [index])
        .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
        .first()

      data.push(Number(transaction.sum))
      labels.push(format(new Date(`${index}`), 'MMM'))
    }

    datasets.push({
      data,
      backgroundColor: type === 'income' ? '#1eb14f' : '#c53030',
      label: type === 'income' ? 'Entrada' : 'Saída',
    })

    return { labels, datasets }
  }

  async index({ auth, response, request }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const { year = new Date().getFullYear() } = request.get()

    const income = await this.convertData({
      userId: auth.user.id,
      year,
      type: 'income',
    })

    const outcome = await this.convertData({
      userId: auth.user.id,
      year,
      type: 'outcome',
    })

    return {
      income,
      outcome,
    }
  }
}

module.exports = ChartController
