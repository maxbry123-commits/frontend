# METODO DE TRABAJO — PLANTILLA v1 (candidata a aprobación)

Ley: esta plantilla es inmutable una vez aprobada. No se cambia en medio de una tarea. Mejora solo por orden explícita del usuario.

---

## 0. LEYES INMUTABLES

1. Input block = leer **literal**. No reinterpretar.
2. Orden del usuario → ejecutar. No negociar el método.
3. Un solo objetivo grande por turno.
4. Primero plan, luego código.
5. Mostrar **resultado de cada paso de razonamiento** en el chat (no solo “hecho”).
6. Nunca cerrar con gaps: 3 verificaciones antes de decir cerrado.
7. Cuaderno anti-alucinación: en cada input releer TAREAS-EN-CURSO + BITACORA-RESUMEN + LEY-CUADERNO + docs FROMTED activos del PASO en curso.
8. No docs nuevos sin trazabilidad; info nueva fuera de plan → actualizar plan + documento.
9. Download OS = determinista (manifest + SHA + inventory). No main/master libre si hay SHA.
10. Evitar sobreingeniería. Menor token + más avanzado. No MVP flojo.

---

## 1. CUANDO EL USUARIO DICE «ANALIZA / INVESTIGA / PLANIFICA [TEMA]»

Ejecutar **en orden** y **mostrar en el chat** el resultado de cada paso:

```
PASO 1  AUDITORÍA INPUT
PASO 2  METAS (hasta 6)
PASO 3  REFUTACIÓN / RIESGOS
PASO 4  INVESTIGACIÓN WEB + REPOS (≥ fuentes según tema; mínimo 5 URLs reales)
PASO 5  TRAZABILIDAD CODE / TECH
PASO 6  OPEN SOURCE DETERMINISTA (manifest candidates)
PASO 7  PLAN DE DISEÑO (si aplica UI)
PASO 8  PLAN DE IMPLEMENTACIÓN (tareas numeradas)
PASO 9  TRIPLE VERIFICACIÓN (¿falta algo del input?)
PASO 10 SALIDA ESTRUCTURADA + docs GitHub si corresponde
```

Cada PASO en el chat tiene forma:

```
### PASO N — NOMBRE
**Resultado:**
…detalle…
```

No omitir la palabra **Resultado:**.

---

## 2. PASO 1 — AUDITORÍA INPUT

**Hacer:**
- Listar cada requisito del mensaje, numerado.
- Marcar cuáles ya están en docs del cuaderno.
- Marcar huecos.

**Resultado visible:** lista numerada + tabla cubierto/falta.

---

## 3. PASO 2 — METAS

**Hacer:** convertir requisitos en ≤6 metas medibles.

**Resultado visible:** lista 1…6.

---

## 4. PASO 3 — REFUTACIÓN / RIESGOS

**Hacer:** qué puede fallar (ToS, RAM, licencia, alucinación de repo, sobreingeniería).

**Resultado visible:** riesgos + mitigación en una línea cada uno.

---

## 5. PASO 4 — SISTEMA DE INVESTIGACIÓN

**Orden de fuentes (ampliado 10x):**
1. Capacidades oficiales (docs, API reference)
2. Repos GitHub (README, license, stars, last commit)
3. GitHub Discussions / Issues relevantes
4. Stack Overflow / DEV.to
5. Reddit / HN (limitaciones reales de usuarios)
6. Comparativas 2025–2026
7. MCP / skills si aplica agentes
8. ToS / licencia (MIT, Apache, AGPL, propietario)

**Por cada candidato anotar:**
- URL exacta
- Licencia
- Qué problema resuelve
- Si entra en UI (chrome nativo) o backend/tool
- Riesgo ToS / self-host

**Resultado visible:** tabla | Proyecto | URL | Licencia | Rol | Riesgo |

Mínimo **5 filas** con URL real. Temas grandes: objetivo ≥20 repos cuando el usuario lo pida (PASO 1 FROMTED).

---

## 6. PASO 5 — TRAZABILIDAD DE CODE / TECH

**Resultado visible — tabla obligatoria:**

| Función del producto | Tecnología | Repo/URL | Corre en |
|----------------------|------------|----------|----------|
| … | … | … | UI / backend / tool / device |

Nada de “usaremos algo moderno” sin nombre + URL.

---

## 7. PASO 6 — OPEN SOURCE DETERMINISTA

**Algoritmo fijo:**
1. Lista repos en manifest (no descubrir en caliente en install)
2. URL oficial registrada
3. Clone
4. Checkout SHA o tag fijado (si no hay SHA: clonar default branch, registrar HEAD, fijar SHA)
5. Verificar SHA
6. Solo instalador oficial del repo si existe
7. SUCCESS | FAILED por repo
8. `inventory.json` al final

**Reglas:** no main libre si hay SHA; no sustituir repo; fallo crítico → STOP; opcional → LOG NEXT.

**Resultado visible:** fragmento `manifest.sources.json` propuesto + lista oleada.

---

## 8. PASO 7 — PLAN DE DISEÑO (si UI)

**Incluir:**
- Tokens / colores (si hay spec)
- Pantallas / paneles IDs
- Qué se retinta vs qué es nuevo
- Regla nativo (no mostrar chrome de terceros)

**Resultado visible:** mapa de pantallas + principios numerados + CONFIRMADO o PENDIENTE APROBACIÓN.

---

## 9. PASO 8 — PLAN DE IMPLEMENTACIÓN Y TAREAS

**Formato:**
- Fases (I0, I1, …) con rango de tareas
- Tareas numeradas 1…N (detalle suficiente para ejecutar sin reinterpretar)
- Dependencias solo si bloquean
- Checkpoint cada fase

**Resultado visible:**
```
Fase Ix (tareas a–b)
  a. …
  b. …
```

Primero plan, luego código. Archivos uno a uno; diffs antes de cambios masivos.

---

## 10. PASO 9 — TRIPLE VERIFICACIÓN

**Resultado visible:**

| # | Requisito del input | ¿Cubierto en salida? | Dónde |
|---|---------------------|----------------------|-------|
| 1 | … | sí/no | PASO x / doc y |

Si algún **no** → no cerrar; completar o declarar bloqueo explícito.

Tres pasadas mentales:
1. ¿Está cada punto del input?
2. ¿Hay URL/tech para cada claim técnico?
3. ¿El plan es ejecutable sin decidir en caliente?

---

## 11. PASO 10 — SALIDA Y DOCUMENTOS

- Detalle **en el chat** (no solo link).
- Si el usuario pidió guardar: crear/actualizar doc en GitHub con nombre `PROYECTO-…` o `METODO-…` y anotar en TAREAS-EN-CURSO / bitácora por referencia.
- Un objetivo; no mezclar VPS + FROMTED en la misma salida salvo orden.

---

## 12. VARIANTES DE TRIGGER

| Usuario dice | Plantilla |
|--------------|-----------|
| Analiza / Investiga X | PASOS 1–10 completos |
| Explica detalladamente X | Problema + 5 soluciones (enumeradas) + tech |
| Cómo hacer X | Lista enumerada de pasos (sin cuadros vacíos) |
| INICIA / RUN INSTALL | Solo flujo determinista; sin análisis creativo |
| Diseña UI | + PASO 7 ampliado + referencias visuales |
| Plan de programación | PASO 8 dominante; tareas 1–N |

---

## 13. MEJORAS 10x vs método suelto anterior

1. **Resultado:** obligatorio en cada paso (antes a veces solo “confirmado”).  
2. Investigación con **8 capas de fuentes** y tabla mínima 5 URLs.  
3. Trazabilidad tech **obligatoria** (nombre + URL + dónde corre).  
4. Bloque determinista de install **separado** del análisis.  
5. Triple verificación **visible** antes de cerrar.  
6. Triggers claros (analiza / inicia / cómo).  
7. Config UI / i18n / memoria device como checklist reutilizable en FROMTED.  
8. Cuaderno: lectura forzada cada input.  
9. Fases + tareas numeradas siempre.  
10. Addendum docs cuando el chat aprueba detalle que no estaba en GitHub.

---

## 14. CHECKLIST RÁPIDA ANTES DE ENVIAR SALIDA

- [ ] ¿Mostré PASO N + **Resultado:**?
- [ ] ¿Listé requisitos del input?
- [ ] ¿Hay tabla tech con URLs?
- [ ] ¿Hay plan de tareas numeradas si pedía plan?
- [ ] ¿Triple verificación sin “no” sin explicar?
- [ ] ¿Detalle en el chat, no solo “está en el doc”?

---

## 15. APROBACIÓN

Estado: **PENDIENTE APROBACIÓN DEL USUARIO**

Si apruebas: esta plantilla pasa a LEY-CUADERNO / METODO activo y se usa en todo “analiza / investiga / planifica”.

FIN PLANTILLA v1
