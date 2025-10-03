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
      text: 'Hello'
      // Missing target_lang
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: text, target_lang')
})

test('translate route requires text field', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/translate',
    payload: {
      target_lang: 'ES'
      // Missing text
    }
  })

  assert.strictEqual(res.statusCode, 400)
  const payload = JSON.parse(res.payload)
  assert.strictEqual(payload.error, 'Missing required fields: text, target_lang')
})
