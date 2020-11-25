'use strict'
const { v4: uuid } = require('uuid')

const User = use('App/Models/User')
const UserToken = use('App/Models/UserToken')
const Env = use('Env')

const Mail = use('Mail')

class ForgotPasswordController {
  async store({ request }) {
    const email = request.input('email')

    // const schemaValidator = schema.create({
    //   email: schema.string({}, [rules.email(), rules.required()]),
    // })

    // await validator.validate({
    //   schema: schemaValidator,
    //   data: {
    //     email,
    //   },
    //   messages: {
    //     'email.required': 'Email is required',
    //   },
    // })

    const user = await User.findByOrFail('email', email)

    const token = uuid()

    await UserToken.create({
      token,
      user_id: user.id,
    })

    await Mail.send(
      'emails/forgot_password',
      {
        name: user.name,
        link: `${Env.get('APP_WEB')}/reset-password?token=${token}`,
      },
      (message) => {
        message
          .from('contato@andrejr.online', '[Equipe Finances]')
          .to(email)
          .subject('Recuperação de senha')
      }
    )
  }
}

module.exports = ForgotPasswordController
