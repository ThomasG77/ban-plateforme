const {finishComposition} = require('../models/commune.cjs')
const mongo = require('../util/mongo.cjs')
const composeCommune = require('./index.cjs')

async function main(options) {
  await mongo.connect()
  const {codeCommune, ignoreIdConfig} = options

  console.time(`commune ${codeCommune}`)

  await composeCommune(codeCommune, ignoreIdConfig)
  await finishComposition(codeCommune)

  console.timeEnd(`commune ${codeCommune}`)
}

module.exports = async function (options, cb) {
  try {
    const result = await main(options)
    cb(null, result)
  } catch (error) {
    console.error(error)
    cb(error)
  }
}
