const DeviceDetector = require('node-device-detector')
const { format } = require('date-fns')
const { pt } = require('date-fns/locale')

const User = use('App/Models/User')
const Mail = use('Mail')

class SessionController {
  async store({ request, response, auth }) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.attempt(email, password, {
      expire: '3 days',
    })

    const detector = new DeviceDetector()
    const userAgent = request.headers()['user-agent']

    const user = await User.findByOrFail('email', email)

    if (userAgent) {
      const device = detector.parseClient(userAgent).name

      Mail.send(
        'emails/access_new',
        {
          name: user.name,
          link: `http://localhost:3000/forgot-password`,
          device,
          email: user.email,
          time: format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
            locale: pt,
          }),
        },
        (message) => {
          message
            .from('contato@andrejr.online', '[Equipe Finances]')
            .to(user.email, user.name)
            .subject('Novo acesso à sua conta')
        }
      )
    }

    await user.load('avatar')

    return {
      user,
      token: token.token,
    }
  }

  async destroy({ auth }) {
    await auth.check()
    const token = auth.getAuthHeader()

    return auth.revokeTokens([token])
  }
}

module.exports = SessionController
