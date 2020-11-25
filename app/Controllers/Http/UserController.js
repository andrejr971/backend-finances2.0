'use strict'

const User = use('App/Models/User')

class UserController {
  async store({ request }) {
    const data = request.only(['name', 'last_name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async show({ auth, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const user = await User.find(auth.user.id)

    await user.load('avatar')

    return user
  }

  async update({ auth, response, request }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const data = request.only(['name', 'last_name', 'email', 'password'])

    const user = await User.findOrFail(auth.user.id)

    user.merge(data)

    await user.save()

    await user.load('avatar')

    return user
  }
}

module.exports = UserController
