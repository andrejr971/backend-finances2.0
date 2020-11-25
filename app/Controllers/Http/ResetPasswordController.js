'use strict'
const { addHours, isAfter } = require('date-fns')

const User = use('App/Models/User')
const UserToken = use('App/Models/UserToken')
const Database = use('Database')

class ResetPasswordController {
  async store({ request, response }) {
    const { token, password, logout } = request.all()

    // const schemaValidator = schema.create({
    //   token: schema.string({}, [rules.required()]),
    //   password: schema.string({}, [rules.required()]),
    // })

    // await validator.validate({
    //   schema: schemaValidator,
    //   data: {
    //     token,
    //     password,
    //   },
    //   messages: {
    //     'token.required': 'Token is required',
    //     'password.required': 'Password is required',
    //   },
    // })

    try {
      const confirmToken = await UserToken.findByOrFail('token', token)
      const parsedDateToken = confirmToken.created_at

      const addHoursToken = addHours(parsedDateToken, 2)

      if (!isAfter(addHoursToken, parsedDateToken)) {
        return response.status(401).send({
          error: {
            message: 'Token invalidate',
          },
        })
      }

      const user = await User.find(confirmToken.user_id)

      if (!user) {
        return response.status(400).send({
          error: {
            message: 'User not found',
          },
        })
      }

      if (logout) {
        await Database.from('tokens').where('user_id', confirmToken.user_id).delete()
      }

      user.password = password

      confirmToken.delete()

      await user.save()
    } catch (err) {
      return response.status(400).send({
        error: {
          message: err,
        },
      })
    }
  }
}

module.exports = ResetPasswordController
