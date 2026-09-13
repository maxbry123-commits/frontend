# N25 Resource Brain — VERIFY_RESEARCH

Node: `N25-RESOURCE-BRAIN`
Contract: `tel.workflow/v3`
Owner invariant: `stabilize_core` remains the only workflow owner.

## Existing reusable primitives

- `plugins.contract.PluginSpec` already carries name, kind, capabilities, source path, pinned source tree SHA, mount path, enabled state and workflow-owner flag.
- `plugins.registry.PluginRegistry` already rejects duplicate plugin names, exposes all registered specs and enforces exactly one workflow owner.
- `plugins.activation.build_runtime_registry` already fails closed for runtime activation outside the explicitly approved adapter set.
- The architecture marks P16 ROUTER partial and P19 RESOURCE_BRAIN GAP. It permits bounded LLM use only for ambiguity resolution/semantic ranking, while routing/state/policy remain deterministic.

## Unique capability gap

There is no deterministic primitive that:

1. selects candidates by an exact required capability;
2. ranks explicit provenance `OFFICIAL > EXISTING > COMMUNITY`;
3. deduplicates candidates without losing source identity;
4. prefers already wired candidates inside the same provenance tier;
5. fails closed when no valid candidate exists.

## Delta decision

`REUSE_EXISTING + ADAPT`: add a thin deterministic selector over `PluginRegistry`/`PluginSpec`. Do not create another scheduler, orchestrator, recovery engine, plugin registry or activation path. Selection does not mount or enable a plugin; activation remains owned by the existing activation gate.

## Test contract

- official provenance beats existing/community;
- same-tier wired resource beats unwired resource;
- exact capability matching only;
- invalid/unpinned identities are rejected;
- missing provenance and no-match cases fail closed;
- duplicate candidate names fail closed rather than silently override provenance.
