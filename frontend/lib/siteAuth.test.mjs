import assert from "node:assert/strict";
import test from "node:test";
import {
  checkSitePassword,
  createSiteSession,
  isValidSiteSession,
  SITE_SESSION_SECONDS,
} from "./siteAuth.ts";

test("validates passwords and signed, expiring sessions", () => {
  process.env.SITE_PASSWORD = "test-password";
  process.env.SITE_SESSION_SECRET = "test-session-secret-at-least-32-characters";
  const now = 1760000000000;
  assert.equal(checkSitePassword("wrong"), false);
  assert.equal(checkSitePassword("test-password"), true);
  const session = createSiteSession(now);
  assert.equal(isValidSiteSession(session, now), true);
  assert.equal(isValidSiteSession(`${session}0`, now), false);
  const [expiry, mac] = session.split(".");
  assert.equal(isValidSiteSession(`${expiry}.${(mac[0] === "0" ? "1" : "0") + mac.slice(1)}`, now), false);
  assert.equal(isValidSiteSession(session, now + SITE_SESSION_SECONDS * 1000), false);
  process.env.SITE_PASSWORD = "another-password";
  assert.equal(isValidSiteSession(session, now), false);
});

test("fails closed when authentication configuration is missing", () => {
  delete process.env.SITE_PASSWORD;
  assert.throws(() => isValidSiteSession(undefined), /must be configured/);
});
