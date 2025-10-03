const { test } = require('node:test')
const { build } = require('../helper')

test('CORS headers are set correctly', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/translate',
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  })

  t.assert.strictEqual(res.statusCode, 204)
  t.assert.strictEqual(res.headers['access-control-allow-origin'], 'https://localhost:3000')
  t.assert.ok(res.headers['access-control-allow-methods'].includes('POST'))
  t.assert.ok(res.headers['access-control-allow-headers'].includes('Content-Type'))
})

test('CORS allows actual requests from localhost:3000', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/',
    method: 'GET',
    headers: {
      'Origin': 'https://localhost:3000'
    }
  })

  t.assert.strictEqual(res.headers['access-control-allow-origin'], 'https://localhost:3000')
})