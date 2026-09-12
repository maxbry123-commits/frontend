# FACTORY V1.1 — LIVE BROWSER LOOP20 EVIDENCE — 2026-09-12

Identity: `➡️ Astra plan fábrica UI YAIWES`
Gate: `T1_FACTORY_FRONTEND`
Source SHA tested: `245efadec5f01513c8ee4203224fba739ad0d2f2`
Space: `COMAND-CENTER-1/yaiwes-ui-factory`
HF Space commit: `2621ef7d770a84d2ff43afbb70f6a699a535f591`
URL: `https://comand-center-1-yaiwes-ui-factory.static.hf.space/`

## Regression that reopened T1
A live-browser audit proved the previous closure insufficient: expected panel visibility was not directly verified. T1 was reopened fail-closed.

## StrategyDelta
1. Configuration panel made visible by default.
2. Stable IDs added for the ten functional configuration panels.
3. Theme panel/control ID collision removed.
4. Media generation status renderer corrected so `BLOCKED_NO_MODEL` / execution state is observable.
5. Workflow repinned to exact repaired source SHA.

## Candidate LOOP20
HF Job: https://huggingface.co/jobs/COMAND-CENTER-1/6aa59caa5527934177ed1183
Result: `20 passed`
Marker: `LOOP20_FACTORY_CANDIDATE=PASS`
Coverage:
- configuration visible
- router panel
- all 10 tabs/panels
- add model/team mode
- remote config
- skill add
- URL input
- GitHub input
- HTML input
- file input
- destination/output plan
- multiple references
- page creator
- media upload
- media blocked state
- theme application
- micro-kernel
- steps/modes
- JSON/HTML exports
- toggle/responsive/no-console-errors

## Persistent deployment
GitHub Actions run: https://github.com/maxbry123-commits/frontend/actions/runs/34711961080
OIDC publish: PASS
Package verify: PASS
HF commit: `2621ef7d770a84d2ff43afbb70f6a699a535f591`
Hub read-back: HTTP 200
Static host read-back: HTTP 200

## LIVE LOOP20 against deployed URL
HF Job: https://huggingface.co/jobs/COMAND-CENTER-1/6aa59d0621047bf1b037e15f
Result: `20 passed`
Marker: `LIVE_LOOP20=PASS`

Browser captures produced in the live job:
- Desktop PNG bytes=96388 sha256=`a2029a700477fc235309c24888ad19f5e9bcd99f419471a765c5a04b1f9a695f`
- Mobile PNG bytes=99929 sha256=`9cc032e04ed8eee3d4213e9162832b34af8ce5aaa45a53480532eac9271a332a`

## Independent live-browser reviewer
HF Job: https://huggingface.co/jobs/COMAND-CENTER-1/6aa59d3021047bf1b037e163
Result: `INDEPENDENT_BROWSER_REVIEWER=PASS`
Desktop: HTTP 200, panelCount=10, visibleTabs=10, buttonCount=54, visible-button clicks OK=29, failures=0, consoleErrors=0, no horizontal overflow.
Mobile: HTTP 200, panelCount=10, visibleTabs=10, buttonCount=54, visible-button clicks OK=29, failures=0, consoleErrors=0, no horizontal overflow.

## Security boundary
Static frontend stores only endpoint configuration / `secret_ref`; no raw API keys are committed. Remote AI/media execution is fail-closed when a configured Router/MCP/HTTP endpoint is absent.

## Closure decision
The specific regression `LIVE_UI_PANEL_VISIBILITY_AND_EFFECT_TESTS` is resolved. Factory V1.1 satisfies the revised browser-closure gate with candidate LOOP20 + OIDC deploy + live LOOP20 + independent browser reviewer.
