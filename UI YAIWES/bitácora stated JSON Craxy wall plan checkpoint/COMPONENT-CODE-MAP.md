# COMPONENT CODE MAP — P01 baseline 14 + revalidación post-124

Destino central físico: `UI YAIWES/componentes open soure UI YAIWES/`
Tree raíz destino actual: `4be4e359804da7fe59e8874c057a45a0a2967f63`
Regla: presencia física o checkout no equivale a integración; dedup solo por SOURCE_COMMIT + code-root/tree.

|#|Componente|SOURCE_URL|SOURCE_COMMIT|Tree físico|Code root / tree|Destino/dedup|
|---|---|---|---|---|---|---|
|1|Apache PyCasbin|https://github.com/apache/casbin-pycasbin|bf5a94be899c3eb14e9d9509904a3b38d9f2cf71|ca8d5efdcb1b63bbfabf07e6679075134391b314|`casbin/` / ec2e719085272a06bc13a275c226f767f2202682|CENTRAL_ONLY; no root duplicate|
|2|Bulkman|https://github.com/rodmena-limited/bulkman|99607f7e1b881a68cc99305ab233299c57469414|271c64e915a38926db06754adc6c20841a4a4dd0|`bulkman/` / c964f8b80bb8e9f5492c5a87a3eeb0bdc43f21af|CENTRAL_ONLY; no root duplicate|
|3|Dagu|https://github.com/dagucloud/dagu|79747252180ee17f451267d7e2e098e219a04722|766403bfa76c123b3d8bf9f2a9be3008e4e0d2eb|Go runtime inspected|CENTRAL DONOR ONLY; no scheduler copy|
|4|HTTPX|https://github.com/encode/httpx|b5addb64f0161ff6bfe94c124ef76f6a1fba5254|50f3492d7c603cfd94e5029870ac7546666dec5e|`httpx/` / 21eaf49210613909be2f7a864389a312a484d0eb|CENTRAL_ONLY; adapter pending|
|5|Hypothesis|https://github.com/HypothesisWorks/hypothesis|a8dcd7422a325926693b5464f73349e361562b7c|c7a0b0e22f5d5b63fd1f97fbd4dbf65a781e865c|`hypothesis/` / 00faf44525a3d94adaa885d5e33480206439dc0c|CENTRAL TEST_ONLY|
|6|OpenTelemetry Python|https://github.com/open-telemetry/opentelemetry-python|96df63add12f6e0453b265ac34c5c07ec7b9267e|2a74339d862124f2637247862f53497448619d49|`opentelemetry-api/src/opentelemetry/` / 6b978f11923255b723f51a93168fa5c2d9752b4d|CENTRAL_ONLY; SDK separate pending|
|7|Pydantic|https://github.com/pydantic/pydantic|c23cb86ef197693fc016437614f174252a3d189a|41f2003ff0dd618e9f0b751b01bcea3f1deb5c6f|`pydantic/` / c04b6070f1a19b5c7dfdecc10ce28ba1a4afee9b|CENTRAL_ONLY; pydantic-core dependency separate|
|8|Rule Engine|https://github.com/zeroSteiner/rule-engine|c166666f66acabfa42856639812a3c20ae04da60|ab1bbafa70cc9fb0dc1f82c138e5a6a734e9a882|`lib/` / d3688e96ee18daad0283f8a6beff6e56710380cf|CENTRAL_ONLY; policy pending|
|9|Stabilize CORE|https://github.com/rodmena-limited/stabilize|471b501e73a74affd504364c601e5cb7c6296c33|4698f403b847a5cc7aecd4b6f22a1636ca8be98b|`src/stabilize/` / 35c7f5b60ee6cf8fd5ae3187d6e92fe15012499b|CENTRAL + code-only vendor copy; no duplicate repo|
|10|Starlette|https://github.com/Kludex/starlette|0fcaff1d1e1d16a702a06b40d20092cc9d84d4a3|9d9ad977106de6488276491f051c93a2698954e7|`starlette/` / 820b2cdde800811062b2be43abd909e27b38854f|CENTRAL_ONLY; API adapter pending|
|11|pytest|https://github.com/pytest-dev/pytest|1f787563f0a174f938ad3415c2ecd90ae35f03e2|05ba709ff69eab1ecb554ed1da1b7982b36dd64c|`src/` / d1e47d16c856812d6ffe3d5dc224d2301109c1c1|CENTRAL TEST_ONLY|
|12|redun|https://github.com/insitro/redun|49a299b223bc345b999aaa40daa6876f105089e1|e301e8967ebdcb0b27734a820bd2608999b08541|`redun/` / 8970f694f1984aa3e623ce1b2e66ea35cf1cf8ba|CENTRAL DONOR_ONLY; no scheduler mount|
|13|resilient-circuit|https://github.com/rodmena-limited/resilient-circuit|c9d80c845df771a9b9d63f9a48e6f24e6ed0b94a|32c7a96fee897e44e20a85b6e78995cc9bd5a9e3|`resilient_circuit/` / 61ada5ed0ecf9bad6059645264c9fd5549669715|CENTRAL_ONLY; resilience pending|
|14|structlog|https://github.com/hynek/structlog|73393f34b40c15688b3fdd0982889b225f11b59b|5393fcee00ae1ed638601ed9915c78dd862988d5|`src/structlog/` / d64c15da142a3dae10dd1559661c53dd70a521e2|CENTRAL_ONLY; observability pending|
|post124-087|gVisor|https://github.com/google/gvisor|0a1316b0d180600212bd607aa0ccfe2a9b09a899|fa6b9f1ca81285907f24d71ef100410ef48aac1f|candidate donor roots: `pkg/` `2e15553944e5bd392ab69a2faf41c433c5bf6042`; `runsc/` `a489b273ef32786f6dc0e8edc8075fcabc51a2bb`; `sandboxexec/` `dda911c234771df1b581d0c13b4e4c83cc8875be`; `shim/` `e90125b59e26256156dff536285e26601448e8e6`|MATERIALIZED_OK + DONOR_ONLY_UNMAPPED; NO runtime copy/mount until universal-socket contract+adapter+registry+loader+guard+tests exist|

## Regla code-only
No copiar repos completos al runtime. Se omiten `.github`, `.agents`, `.buildkite`, `.claude`, changelogs, docs, examples, release automation y tests upstream del hot path. Licencias/SOURCE_URL/SOURCE_COMMIT/hashes permanecen en la fuente central como provenance. `vendor code present ≠ INTEGRATED`.