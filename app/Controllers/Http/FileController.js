'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async index({ params, response }) {
    const file = await File.findOrFail(params.id)

    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store({ request }) {
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

    return file
  }
}

module.exports = FileController
