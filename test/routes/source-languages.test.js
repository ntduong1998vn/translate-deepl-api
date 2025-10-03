'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { build } = require('../helper')

test('GET /source-languages returns list of source languages', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/source-languages',
    method: 'GET'
  })

  assert.strictEqual(res.statusCode, 200)
  const payload = JSON.parse(res.payload)
  
  // Should return an object with languages array
  assert.ok(payload.languages)
  assert.ok(Array.isArray(payload.languages))
  
  // If DeepL is configured, check language structure
  if (payload.languages.length > 0) {
    const lang = payload.languages[0]
    assert.ok(lang.name)
    assert.ok(lang.code)
  }
})

test('GET /source-languages handles API errors gracefully', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/source-languages',
    method: 'GET'
  })

  // Should either return 200 with languages or 500/502 if DeepL is not configured/fails
  assert.ok(res.statusCode === 200 || res.statusCode === 500 || res.statusCode === 502)
  const payload = JSON.parse(res.payload)
  
  if (res.statusCode === 200) {
    assert.ok(payload.languages)
    assert.ok(Array.isArray(payload.languages))
  } else {
    assert.ok(payload.error)
  }
})
