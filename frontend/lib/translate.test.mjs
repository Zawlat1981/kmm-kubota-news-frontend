import assert from "node:assert/strict";
import test from "node:test";
import { translateBatch } from "./translate.ts";

test("translates into English and keeps blank entries in place", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  });

  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.match(body.messages[0].content, /English/);
    return new Response(JSON.stringify({
      choices: [{ message: { content: "Translated text" } }],
    }), { status: 200 });
  };

  assert.deepEqual(
    await translateBatch(["ทดสอบสถานที่", "", "ทดสอบสถานที่"], "en", true),
    ["Translated text", "", "Translated text"],
  );
});

test("strict translation reports failures rather than returning original text", async (t) => {
  const originalKey = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  t.after(() => {
    if (originalKey !== undefined) process.env.GROQ_API_KEY = originalKey;
  });

  await assert.rejects(
    translateBatch(["สถานที่อื่น"], "my", true),
    /GROQ_API_KEY is not set/,
  );
});

test("development translation does not disable TLS certificate verification", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  const originalEnvironment = process.env.NODE_ENV;
  const originalTls = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.GROQ_API_KEY = "test-key";
  process.env.NODE_ENV = "development";
  delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      GROQ_API_KEY: originalKey, NODE_ENV: originalEnvironment, NODE_TLS_REJECT_UNAUTHORIZED: originalTls,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  globalThis.fetch = async () => new Response(JSON.stringify({
    choices: [{ message: { content: "Translated" } }],
  }), { status: 200 });

  await translateBatch(["ข้อความทดสอบ TLS"], "th", true);
  assert.equal(process.env.NODE_TLS_REJECT_UNAUTHORIZED, undefined);
});

test("strict translation rejects truncated model responses", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = "test-key";
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  });
  globalThis.fetch = async () => new Response(JSON.stringify({
    choices: [{ finish_reason: "length", message: { content: "Incomplete" } }],
  }), { status: 200 });
  await assert.rejects(translateBatch(["ข้อความที่ยาว"], "my", true), /truncated/);
});
