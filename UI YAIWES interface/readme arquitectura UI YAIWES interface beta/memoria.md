# Memoria de continuidad — UI YAIWES frontend

## Estado actual

- Proyecto: `UI YAIWES interface`.
- Alcance: frontend modular.
- Backend: solo frontera de contrato; no se implementa aquí.
- Originales: bloqueados y no tocar.
- Método: pieza por pieza, canvas local, discusión, aprobación por ID e integración posterior.
- Primer vertical slice: `RUN-01 / CASCADE`.
- Estado: `ACTIVE_REVIEW`.

## Documentos de control

- `PLAN-DE-TRABAJO-UI-YAIWES.md`: guía maestra.
- `CRAZY-WALL-BITACORA-STATE.json`: tablero de estado, eventos y decisiones.
- `HANDOFF-FRONTEND-UI-YAIWES.json`: contrato para el siguiente equipo o IA.
- Arquitectura existente: carpeta `readme arquitectura UI YAIWES interface beta/`.

## Arquitectura que no se debe romper

```text
Usuario → Panel A/B → UI Contract → Action Bus → Bridge → Backend frontera → Eventos → Canvas
```

El frontend no debe duplicar proveedores, router, scheduler, memoria backend, secretos u orquestación interna.

## Reglas de colaboración

1. Leer el plan, la bitácora, el handoff y esta memoria antes de actuar.
2. Auditar las fuentes de la pieza asignada.
3. Mantener originales intactos.
4. Registrar cada pieza con ID.
5. Mostrar primero un canvas reversible.
6. Explicar qué es real, stub y frontera backend.
7. No integrar sin `OK <ID>`.
8. Si hay contradicción, marcar `BLOCKED`; no inventar.
9. Actualizar bitácora, handoff y memoria después de una decisión.
10. Usar componentes del catálogo solo con procedencia y propósito claros.

## Decisiones pendientes

- Elegir dirección visual: `A-Matte-Control`, `B-Holographic-Glass` o `C-Little-Factory`.
- Confirmar que Little azul queda fijado en `#2563eb` para UI YAIWES.
- Confirmar `RUN-01` como primer vertical slice.

## Registro

### 2026-09-27

Se auditó la arquitectura, el índice de 39 ventanas, las referencias de fotos, `Run.html`, la fábrica de componentes y los skills de diseño. Se creó el plan modular, el estado Crazy Wall y el handoff JSON para continuidad entre equipos.

## Plantilla de entrada para el siguiente equipo

```text
ID:
Objetivo:
Fuentes leídas:
Componentes candidatos:
Qué no tocaré:
Canvas mostrado:
Decisión solicitada:
Estado:
Pruebas:
Handoff actualizado: sí/no
```
