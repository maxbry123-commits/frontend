import assert from "node:assert/strict";
import test from "node:test";
import { SKILLS, STAGES, SYSTEMS } from "./cartilla.ts";

test("la cartilla tiene 20 sistemas, 20 skills y la idea separada", () => {
  assert.equal(SYSTEMS.length, 20);
  assert.equal(SKILLS.length, 20);
  assert.equal(STAGES.length, 12);
  assert.notEqual(STAGES[0].systemPrompt, STAGES[3].systemPrompt);
  assert.match(STAGES[0].systemPrompt, /solo el agente de la idea/i);
  assert.equal(new Set(SYSTEMS.map((item) => item.repo)).size, 20);
});
