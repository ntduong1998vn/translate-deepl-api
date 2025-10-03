'use strict'

const fp = require('fastify-plugin')

/**
 * This plugin configures CORS (Cross-Origin Resource Sharing) to allow
 * requests from localhost:3000 and other trusted origins.
 */
module.exports = fp(async function (fastify, opts) {
  await fastify.register(require('@fastify/cors'), {
    // Allow requests from localhost on different ports (common for development)
    origin: [
      'https://localhost:3000',
      'http://localhost:3000',
      // Add your production domain here when needed
      // 'https://yourdomain.com'
    ],
    // Allow common HTTP methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Allow common headers
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    // Allow credentials (cookies, authorization headers, etc.)
    credentials: true
  })
})