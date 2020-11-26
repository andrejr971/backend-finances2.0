'use strict'

const File = use('App/Models/File')
const User = use('App/Models/User')
const Helpers = use('Helpers')

// const fs = require('fs')

class UpdateAvatarUserController {
  async store({ request, auth, response }) {
    if (!auth.user) {
      return response.status(401).send({
        error: {
          message: 'User no unathorization',
        },
      })
    }

    const user = await User.findOrFail(auth.user.id)

    // if (user.file_id) {
    //   await user.load('avatar')

    //   const filePath = Helpers.tmpPath(`uploads/${user.avatar.file}`)

    //   console.log(filePath)

    //   // try {
    //   await fs.promises.stat(filePath)
    //   // } catch {
    //   //   return
    //   // }

    //   const existFile = await File.findOrFail(user.file_id)

    //   await fs.promises.unlink(filePath)

    //   await existFile.delete()
    // }

    const upload = request.file('file', {
      size: '2mb',
    })

    if (!upload) {
      return 'Please upload file'
    }

    if (upload.hasErrors) {
      return upload.errors
    }

    const filename = `${Date.now()}.${upload.subtype}`

    await upload.move(Helpers.tmpPath('uploads'), {
      name: filename,
    })

    const file = await File.create({
      file: filename,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype,
    })

    user.file_id = file.id

    await user.save()
    await user.load('avatar')

    return user
  }
}

module.exports = UpdateAvatarUserController
