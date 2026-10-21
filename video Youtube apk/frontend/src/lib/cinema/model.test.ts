import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runCommand } from "./commands.ts";
import {
  AGENTS,
  classifyIncoming,
  fitMeasured,
  frameToleranceMs,
  GOAL_LEDGER,
  hasFtyp,
  ingestClip,
  openProject,
  planAssembly,
  PROFILES,
  readyStats,
  REFUTATIONS,
  remoteUrlVerdict,
  SEQUENCE_BASE,
  type Clip,
  type ProfileId,
} from "./model.ts";

function clip(over: Partial<Clip> & Pick<Clip, "clipId" | "sequenceIndex">): Clip {
  return {
    schemaVersion: "yaiwes.clip.v1",
    jobId: `job-${over.clipId}`,
    idempotencyKey: over.idempotencyKey ?? over.clipId,
    projectId: "campaign-001",
    topicId: "topic-001",
    agentId: "grok-session-01",
    profile: "REEL_59",
    fileName: `${over.clipId}.mp4`,
    sha256: over.sha256 ?? `hash-${over.clipId}`,
    declaredDurationMs: 5000,
    measuredDurationMs: 5000,
    width: 360,
    height: 640,
    mimeType: "video/mp4",
    language: "es-419",
    status: "READY",
    hasBlob: true,
    aspectAccepted: false,
    createdAt: "2026-10-19T04:00:00.000Z",
    note: null,
    ...over,
  };
}

function reelSet(count: number, ms = 5000): Clip[] {
  return Array.from({ length: count }, (_, i) =>
    clip({ clipId: `c${i}`, sequenceIndex: i, measuredDurationMs: ms, sha256: `h${i}` }),
  );
}

describe("ingest", () => {
  it("keeps one clip when the same key is posted ten times", () => {
    let rows: Clip[] = [];
    const incoming = clip({ clipId: "new", sequenceIndex: 3, idempotencyKey: "same", sha256: "abc" });
    let created = 0;
    for (let n = 0; n < 10; n += 1) {
      const result = ingestClip(rows, { ...incoming, clipId: `try-${n}` });
      assert.equal(result.ok, true);
      if (result.ok && result.action === "CREATED") {
        created += 1;
        rows = [...rows, result.clip];
      } else if (result.ok) {
        assert.equal(result.action, "ACK_DUPLICATE");
      }
    }
    assert.equal(created, 1);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.idempotencyKey, "same");
  });

  it("does not overwrite a different hash at the same index", () => {
    const existing = [clip({ clipId: "a", sequenceIndex: 1, sha256: "one" })];
    const result = ingestClip(
      existing,
      clip({ clipId: "b", sequenceIndex: 1, sha256: "two", idempotencyKey: "other" }),
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "CONFLICT_INDEX");
    assert.equal(existing[0]?.sha256, "one");
  });

  it("keeps twelve agents in separate projects from mixing slots", () => {
    const rows = AGENTS.map((agentId, i) =>
      clip({
        clipId: agentId,
        agentId,
        sequenceIndex: 0,
        projectId: `p-${i}`,
        sha256: `hash-${i}`,
      }),
    );
    assert.equal(new Set(rows.map((r) => r.projectId)).size, 12);
    const again = ingestClip(rows, { ...rows[4]!, clipId: "dup" });
    assert.equal(again.ok && again.action, "ACK_DUPLICATE");
  });
});

describe("assembly", () => {
  it("refuses to build when index 6 is missing even if duration would pass", () => {
    const rows = reelSet(12).filter((c) => c.sequenceIndex !== 6);
    const project = {
      ...openProject({ projectId: "campaign-001", topicId: "topic-001", profile: "REEL_59" }),
      closed: true,
      finalSequenceIndex: 11,
      status: "CLOSED" as const,
    };
    const plan = planAssembly({ clips: rows, project, fps: 30 });
    assert.equal(plan.ok, false);
    if (!plan.ok) {
      assert.equal(plan.code, "GAP");
      assert.ok(plan.missing?.includes(6));
    }
  });

  it("trims 12x5s down to 59000ms and does not claim an export", () => {
    const project = {
      ...openProject({ projectId: "campaign-001", topicId: "topic-001", profile: "REEL_59" }),
      closed: true,
      finalSequenceIndex: 11,
      status: "CLOSED" as const,
    };
    const plan = planAssembly({ clips: reelSet(12), project, fps: 30 });
    assert.equal(plan.ok, true);
    if (plan.ok) {
      assert.equal(plan.expectedDurationMs, PROFILES.REEL_59.targetMs);
      assert.equal(plan.used.at(-1)?.trimMs, 1000);
      assert.equal(plan.exportStatus, "SOLO_EN_APK");
      assert.equal(plan.verifiedExport, false);
      assert.ok(Math.abs(plan.toleranceMs - frameToleranceMs(30)) < 0.001);
    }
  });

  it("does not treat a short closed reel as ready", () => {
    const project = {
      ...openProject({ projectId: "campaign-001", topicId: "topic-001", profile: "REEL_59" }),
      closed: true,
      finalSequenceIndex: 1,
      status: "CLOSED" as const,
    };
    const plan = planAssembly({ clips: reelSet(2), project, fps: 30 });
    assert.equal(plan.ok, false);
    if (!plan.ok) assert.equal(plan.code, "DURATION_SHORT");
  });

  it("does not count a later clip toward a contiguous progress bar", () => {
    const rows = [
      clip({ clipId: "a", sequenceIndex: 0, measuredDurationMs: 5000 }),
      clip({ clipId: "c", sequenceIndex: 2, measuredDurationMs: 50000 }),
    ];
    const stats = readyStats(rows, {
      projectId: "campaign-001",
      topicId: "topic-001",
      profile: "REEL_59",
    });
    assert.equal(stats.contiguousMs, 5000);
    assert.deepEqual(stats.gaps, [1]);
    assert.equal(SEQUENCE_BASE, 0);
  });

  it("blocks a non-mp4 and a wrong aspect", () => {
    assert.equal(
      classifyIncoming({ sniffedMp4: false, width: 360, height: 640, profile: "REEL_59" }).status,
      "BLOCKED",
    );
    assert.equal(hasFtyp(Uint8Array.from([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70])), true);
    assert.equal(hasFtyp(Uint8Array.from([0, 0, 0, 0, 1, 2, 3, 4])), false);
    const landscape: ProfileId = "LANDSCAPE_5";
    assert.equal(
      classifyIncoming({ sniffedMp4: true, width: 360, height: 640, profile: landscape }).status,
      "NEEDS_REVIEW",
    );
  });
});

describe("network guard and chat", () => {
  it("rejects private, loopback and non-https urls", () => {
    assert.equal(remoteUrlVerdict("http://example.com/a.mp4").ok, false);
    assert.equal(remoteUrlVerdict("https://127.0.0.1/a.mp4").ok, false);
    assert.equal(remoteUrlVerdict("https://192.168.1.9/a.mp4").ok, false);
    assert.equal(remoteUrlVerdict("https://169.254.169.254/latest").ok, false);
    assert.equal(remoteUrlVerdict("https://user:secret@example.com/a").ok, false);
    assert.equal(remoteUrlVerdict("https://media.example.org/a.mp4").ok, true);
  });

  it("answers queue commands without an external model", () => {
    const project = openProject({
      projectId: "campaign-001",
      topicId: "topic-001",
      profile: "REEL_59",
    });
    const result = runCommand("listar cola", {
      projectId: project.projectId,
      topicId: project.topicId,
      profile: project.profile,
      fps: 30,
      clips: reelSet(1),
      project,
      storageLabel: "desconocido",
    });
    assert.match(result.text, /READY/);
    const unknown = runCommand("escribe un guion", {
      projectId: project.projectId,
      topicId: project.topicId,
      profile: project.profile,
      fps: 30,
      clips: [],
      project,
      storageLabel: "0",
    });
    assert.match(unknown.text, /LLM_NOT_CONFIGURED/);
  });
});

describe("ledger honesty", () => {
  it("does not mark android, export, relay or release as PASS", () => {
    for (const id of ["G04", "G05", "G07", "G08", "G11"]) {
      const goal = GOAL_LEDGER.find((g) => g.id === id);
      assert.ok(goal);
      assert.notEqual(goal?.status, "PASS");
    }
    assert.equal(REFUTATIONS.find((r) => r.id === "F03")?.status, "PASS");
    assert.equal(GOAL_LEDGER.length, 12);
    assert.equal(REFUTATIONS.length, 10);
  });
});

describe("fitMeasured", () => {
  it("packs a queue to the target and trims only the last used shot", () => {
    const fit = fitMeasured(
      [
        { id: "a", sourceMs: 5000 },
        { id: "b", sourceMs: 5000 },
        { id: "c", sourceMs: 5000 },
      ],
      12000,
    );
    assert.equal(fit.status, "FIT");
    assert.equal(fit.remainMs, 0);
    assert.deepEqual(
      fit.pieces.map((piece) => [piece.sequenceIndex, piece.id, piece.useMs, piece.trimMs]),
      [
        [0, "a", 5000, 0],
        [1, "b", 5000, 0],
        [2, "c", 2000, 3000],
      ],
    );
  });

  it("stays short instead of inventing duration", () => {
    const fit = fitMeasured([{ id: "a", sourceMs: 4000 }], 60000);
    assert.equal(fit.status, "DURATION_SHORT");
    assert.equal(fit.remainMs, 56000);
  });
});
