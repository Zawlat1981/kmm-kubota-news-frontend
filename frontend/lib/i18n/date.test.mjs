import assert from "node:assert/strict";
import test from "node:test";
import { formatLocalizedDate } from "./date.ts";

test("formats Myanmar dates even without browser ICU locale support", () => {
  const date = new Date(2026, 10, 24);
  assert.equal(formatLocalizedDate(date, "my", { day: "numeric", month: "short", year: "numeric" }), "၂၄ နိုဝင်ဘာ ၂၀၂၆");
  assert.equal(formatLocalizedDate(date, "my", { month: "long" }), "နိုဝင်ဘာ");
  assert.equal(formatLocalizedDate(date, "my", { month: "long", year: "numeric" }), "နိုဝင်ဘာ ၂၀၂၆");
});

test("formats English and Thai dates using their locales", () => {
  const date = new Date(2026, 10, 24);
  assert.equal(formatLocalizedDate(date, "en", { day: "numeric", month: "short", year: "numeric" }), "Nov 24, 2026");
  assert.match(formatLocalizedDate(date, "th", { day: "numeric", month: "short", year: "numeric" }), /2569/);
});
