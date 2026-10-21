import assert from "node:assert/strict";
import test from "node:test";
import { PLANTILLAS, pickPlantilla, youtubePack } from "./plantillas.ts";

test("hay más de 100 plantillas y cada una tiene código", () => {
  assert.ok(PLANTILLAS.length >= 100);
  assert.equal(new Set(PLANTILLAS.map((item) => item.id)).size, PLANTILLAS.length);
  for (const engine of ["grok", "qwen", "ffmpeg", "youtube", "montaje"] as const) {
    assert.ok(PLANTILLAS.some((item) => item.engine === engine));
  }
  for (const item of PLANTILLAS) {
    assert.ok(item.systemPrompt.length > 40);
    assert.ok(item.code.length > 40);
    assert.equal(item.name.length > 0, true);
  }
  const ffmpeg = PLANTILLAS.filter((item) => item.engine === "ffmpeg");
  for (const item of ffmpeg) {
    assert.ok(item.ffmpegFilter);
    assert.doesNotMatch(item.ffmpegFilter ?? "", /[;&|$`]/);
  }
  const pack = youtubePack("El arquitecto", "Empuje a la mesa", null);
  assert.equal(pack.status, "NOT_UPLOADED");
  assert.equal(pack.reason, "NO_OAUTH");
  assert.ok(pack.title.length <= 70);
  assert.match(pack.description, /generado o alterado con IA/);
  assert.equal(pickPlantilla("mismo", "grok").id, pickPlantilla("mismo", "grok").id);
});
