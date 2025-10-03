'use strict'

/**
 * Target Languages route
 * GET /target-languages
 * 
 * Returns the list of supported target languages from DeepL
 * Each language object contains: name, code, supportsFormality
 * 
 * Requires the DeepL plugin to be registered (provides fastify.deepl decorator)
 */
module.exports = async function (fastify, opts) {
  fastify.get('/target-languages', async (request, reply) => {
    // Check if DeepL client is available
    if (!fastify.deepl) {
      return reply.status(500).send({
        error: 'DEEPL_AUTH_KEY not configured on server'
      })
    }

    try {
      // Get target languages from DeepL
      const targetLanguages = await fastify.deepl.getTargetLanguages()
      
      // Return the list of target languages
      return {
        languages: targetLanguages.map(lang => ({
          name: lang.name,
          code: lang.code,
          supportsFormality: lang.supportsFormality || false
        }))
      }
    } catch (err) {
      request.log.error(err)
      return reply.status(502).send({
        error: 'Failed to fetch target languages from DeepL',
        details: err && err.message ? err.message : String(err)
      })
    }
  })
}
