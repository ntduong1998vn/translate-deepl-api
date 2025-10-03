'use strict'

const fp = require('fastify-plugin')
const deepl = require('deepl-node')

/**
 * This plugin initializes the DeepL client and decorates the fastify instance
 * with a `deepl` property containing the Translator instance.
 * 
 * Requires DEEPL_AUTH_KEY to be set in fastify.config
 * 
 * @see https://github.com/DeepLcom/deepl-node
 */
module.exports = fp(async function (fastify, opts) {
  // Register env config first
  await fastify.register(require('@fastify/env'), {
    confKey: 'config',
    schema: {
      type: 'object',
      required: [],
      properties: {
        DEEPL_AUTH_KEY: { type: 'string' },
        PORT: { type: ['string', 'number'], default: 3000 }
      }
    },
    dotenv: true,
    data: process.env
  })

  const DEEPL_AUTH_KEY = fastify.config && fastify.config.DEEPL_AUTH_KEY

  if (DEEPL_AUTH_KEY) {
    const translator = new deepl.Translator(DEEPL_AUTH_KEY)
    fastify.decorate('deepl', translator)
    fastify.log.info('DeepL client initialized')
  } else {
    fastify.log.warn(
      'DEEPL_AUTH_KEY not set — /translate will return 500 until configured'
    )
    // Decorate with null so routes can check for it
    fastify.decorate('deepl', null)
  }
})
