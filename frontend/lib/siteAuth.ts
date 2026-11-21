import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SITE_SESSION_COOKIE = "kmm_site_session";
export const SITE_SESSION_SECONDS = 7 * 24 * 60 * 60;

function getConfig() {
  const password = process.env.SITE_PASSWORD;
  const secret = process.env.SITE_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) {
    throw new Error("SITE_PASSWORD and SITE_SESSION_SECRET (at least 32 characters) must be configured");
  }
  return { password, secret };
}

function signature(expiry: string, password: string, secret: string) {
  return createHmac("sha256", secret).update(`${expiry}:${password}`).digest("hex");
}

export function checkSitePassword(candidate: string) {
  const { password } = getConfig();
  const actual = createHash("sha256").update(candidate).digest();
  const expected = createHash("sha256").update(password).digest();
  return timingSafeEqual(actual, expected);
}

export function createSiteSession(now = Date.now()) {
  const { password, secret } = getConfig();
  const expiry = String(Math.floor(now / 1000) + SITE_SESSION_SECONDS);
  return `${expiry}.${signature(expiry, password, secret)}`;
}

export function isValidSiteSession(token: string | undefined, now = Date.now()) {
  const { password, secret } = getConfig();
  if (!token) return false;
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[1]) <= Math.floor(now / 1000)) return false;
  const actual = Buffer.from(match[2], "hex");
  const expected = Buffer.from(signature(match[1], password, secret), "hex");
  return timingSafeEqual(actual, expected);
}
