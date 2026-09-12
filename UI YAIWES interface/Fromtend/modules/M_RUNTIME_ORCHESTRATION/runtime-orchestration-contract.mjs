// T2-R5A2 — frontend-only contract wiring RUN-07 editor + RUN-08 inspector.
// Owner: ➡️ Astra plan fábrica UI YAIWES
// Policy: fail-closed; no backend writes; no raw secret handling.

export const RUNTIME_ORCHESTRATION_WINDOWS = Object.freeze({
  editor: "RUN-07",
  inspector: "RUN-08",
});

const SAFE_INSPECTOR_FIELDS = new Set(["nodeId", "status", "input", "output", "error"]);
const SECRET_FIELD = /(token|secret|password|credential|api[_-]?key|private[_-]?key)/i;

function assertPlainObject(value, code) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(code);
}

function assertNoSecretFields(value, path = "payload") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretFields(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (SECRET_FIELD.test(key)) throw new Error(`RAW_SECRET_FIELD_DENIED:${path}.${key}`);
    assertNoSecretFields(child, `${path}.${key}`);
  }
}

function freezeSnapshot(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(freezeSnapshot));
  if (!value || typeof value !== "object") return value;
  const copy = {};
  for (const [key, child] of Object.entries(value)) copy[key] = freezeSnapshot(child);
  return Object.freeze(copy);
}

export function createRuntimeOrchestrationContract({ codeMirrorAdapter, actionBus, postMessageTarget } = {}) {
  if (!codeMirrorAdapter || typeof codeMirrorAdapter.mount !== "function") {
    throw new Error("CODEMIRROR_ADAPTER_REQUIRED");
  }
  if (!actionBus || typeof actionBus.publish !== "function") {
    throw new Error("ACTION_BUS_REQUIRED");
  }
  if (postMessageTarget != null && typeof postMessageTarget.postMessage !== "function") {
    throw new Error("POSTMESSAGE_TARGET_INVALID");
  }

  const publish = (type, payload) => {
    assertNoSecretFields(payload);
    const event = Object.freeze({ schema: "yaiwes.runtime-orchestration.v1", type, payload: freezeSnapshot(payload) });
    actionBus.publish(event);
    if (postMessageTarget) postMessageTarget.postMessage(event, "*");
    return event;
  };

  return Object.freeze({
    windows: RUNTIME_ORCHESTRATION_WINDOWS,

    mountRun07Editor({ parent, doc = "", extensions = [] } = {}) {
      const session = codeMirrorAdapter.mount({
        parent,
        doc,
        extensions,
        onChange(value) {
          publish("RUN07_DOCUMENT_CHANGED", { windowId: RUNTIME_ORCHESTRATION_WINDOWS.editor, value });
        },
      });
      return Object.freeze({
        windowId: RUNTIME_ORCHESTRATION_WINDOWS.editor,
        getValue: () => session.getValue(),
        setValue: (value) => session.setValue(value),
        destroy: () => session.destroy(),
      });
    },

    updateRun08Inspector(snapshot = {}) {
      assertPlainObject(snapshot, "RUN08_SNAPSHOT_OBJECT_REQUIRED");
      for (const key of Object.keys(snapshot)) {
        if (!SAFE_INSPECTOR_FIELDS.has(key)) throw new Error(`RUN08_FIELD_DENIED:${key}`);
      }
      assertNoSecretFields(snapshot);
      return publish("RUN08_INSPECTOR_UPDATED", {
        windowId: RUNTIME_ORCHESTRATION_WINDOWS.inspector,
        snapshot,
      });
    },
  });
}
