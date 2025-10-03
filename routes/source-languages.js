'use strict'

/**
 * Source Languages route
 * GET /source-languages
 * 
 * Returns the list of supported source languages from DeepL
 * Each language object contains: name, code
 * 
 * Requires the DeepL plugin to be registered (provides fastify.deepl decorator)
 */
module.exports = async function (fastify, opts) {
  fastify.get('/source-languages', async (request, reply) => {
    // Check if DeepL client is available
    if (!fastify.deepl) {
      return reply.status(500).send({
        error: 'DEEPL_AUTH_KEY not configured on server'
      })
    }

    try {
      // Get source languages from DeepL
      const sourceLanguages = await fastify.deepl.getSourceLanguages()
      
      // Return the list of source languages
      return {
        languages: sourceLanguages.map(lang => ({
          name: lang.name,
          code: lang.code
        }))
      }
    } catch (err) {
      request.log.error(err)
      return reply.status(502).send({
        error: 'Failed to fetch source languages from DeepL',
        details: err && err.message ? err.message : String(err)
      })
    }
  })
}
