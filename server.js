"use strict"

import Fastify from "fastify";
import * as deepl from "deepl-node";
import fastifyEnv from "@fastify/env";

const fastify = Fastify({
  logger: true,
});

// We'll load configuration (including .env) using @fastify/env and expose it
// on `fastify.config`. Define a JSON schema for expected env values.
const schema = {
  type: "object",
  required: [], // keep optional; we'll warn if DEEPL_AUTH_KEY missing
  properties: {
    DEEPL_AUTH_KEY: { type: "string" },
    PORT: { type: ["string", "number"], default: 3000 },
  },
};

let deeplClient = null;

// Register the env plugin to populate `fastify.config` from process.env and .env
fastify.register(fastifyEnv, {
  confKey: "config", // available at fastify.config
  schema,
  dotenv: true,
  data: process.env,
});

// Translate route
// POST /translate
// Body: { text: string | string[], target_lang: string, source_lang?: string, options?: object }
fastify.post("/translate", async (request, reply) => {
  const {
    text,
    target_lang: targetLang,
    source_lang: sourceLang,
    options,
  } = request.body || {};

  if (!deeplClient) {
    reply
      .status(500)
      .send({ error: "DEEPL_AUTH_KEY not configured on server" });
    return;
  }

  if (!text || !targetLang) {
    reply
      .status(400)
      .send({ error: "Missing required fields: text, target_lang" });
    return;
  }

  try {
    // translateText accepts string or array of strings as first param
    const result = await deeplClient.translateText(
      text,
      sourceLang || null,
      targetLang,
      options || {}
    );
    // Return the raw DeepL result (could be object or array)
    reply.send({ result });
  } catch (err) {
    request.log.error(err);
    reply.status(502).send({
      error: "DeepL translation failed",
      details: err && err.message ? err.message : String(err),
    });
  }
});

// After env plugin has loaded, initialize the DeepL client and start the server.
fastify.ready((err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  const DEEPL_AUTH_KEY = fastify.config && fastify.config.DEEPL_AUTH_KEY;

  if (DEEPL_AUTH_KEY) {
    deeplClient = new deepl.Translator(DEEPL_AUTH_KEY);
  } else {
    fastify.log.warn(
      "DEEPL_AUTH_KEY not set — /translate will return 500 until configured"
    );
  }

  // Run the server!
  const port =
    fastify.config && fastify.config.PORT ? Number(fastify.config.PORT) : 3000;
  fastify.listen({ port, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  });
});
