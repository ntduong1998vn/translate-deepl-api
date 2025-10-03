'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { build } = require('../helper')

test('translate route validates required fields', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/translate',
    payload: {
      texts: ['Hello']
      // Missing target_lang
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: texts (must be non-empty array), target_lang')
})

test('translate route requires texts field', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/translate',
    payload: {
      target_lang: 'ES'
      // Missing texts
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: texts (must be non-empty array), target_lang')
})

test('translate route requires texts to be a non-empty array', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/translate',
    payload: {
      texts: [],
      target_lang: 'ES'
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: texts (must be non-empty array), target_lang')
})

test('translate route requires texts to be an array', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/translate',
    payload: {
      texts: 'Hello',
      target_lang: 'ES'
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: texts (must be non-empty array), target_lang')
})
