'use strict'

/**
 * Translate route
 * POST /translate
 * Body: { texts: string[], target_lang: string, source_lang?: string, options?: object }
 * 
 * Requires the DeepL plugin to be registered (provides fastify.deepl decorator)
 */
module.exports = async function (fastify, opts) {
  fastify.post('/translate', async (request, reply) => {
    const {
      texts,
      target_lang: targetLang,
      source_lang: sourceLang,
      options
    } = request.body || {}

    // Check if DeepL client is available
    if (!fastify.deepl) {
      return reply.status(500).send({
        error: 'DEEPL_AUTH_KEY not configured on server'
      })
    }

    // Validate required fields
    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return reply.status(400).send({
        error: 'Missing required fields: texts (must be non-empty array), target_lang'
      })
    }

    try {
      // translateText accepts array of strings as first param
      const result = await fastify.deepl.translateText(
        texts,
        sourceLang || null,
        targetLang,
        options || {}
      )
      // Return the raw DeepL result (array of translation objects)
      return { result }
    } catch (err) {
      request.log.error(err)
      return reply.status(502).send({
        error: 'DeepL translation failed',
        details: err && err.message ? err.message : String(err)
      })
    }
  })
}
