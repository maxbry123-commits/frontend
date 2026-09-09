# Explicación simple · cómo vive un botón · fábrica · 4 sistemas

Fecha: 2026-09-09  
Público: el director. Sin jerga.

## 1. Esto no es “una IA”

La IA es **un obrero más**. La casa la sostiene **ingeniería fija**:

- Un botón **siempre** hace el mismo trabajo (como un interruptor).
- Un flujo **siempre** sigue el mismo orden (como una receta).
- Si el paso 3 es “sumar 1”, no improvisa. Es código.
- Si el paso 4 es “preguntar a Grok”, **ahí** entra la IA.
- Si Grok falla, el flujo **no miente**. Dice error.

## 2. Tres piezas (como un restaurante)

| Pieza | Analogía | Qué es |
|-------|----------|--------|
| **Ventana** | La mesa / el menú | Lo que ves. Botones. |
| **Host** | El mesero | Recibe el pedido y lo lleva. |
| **Motor** | La cocina | El workflow interno. Receta paso a paso. |

El usuario **nunca** entra a la cocina.  
Tú (fábrica) **sí**: decides qué hay en el menú y qué receta dispara cada plato.

## 3. Cómo se le da vida a un botón (paso a paso)

1. En la **fábrica** eliges el botón (forma, color, nombre).  
2. Le pones una **etiqueta de trabajo**, no un discurso. Ejemplo: `cascade.correr`.  
3. Esa etiqueta apunta a un **workflow** (archivo de receta: paso A → B → C).  
4. El usuario toca el botón.  
5. La **ventana** no cocina. Solo grita: *“tocaron cascade.correr, aquí va el plato (datos)”*.  
6. El **mesero (host)** lleva ese recado al **motor**.  
7. El motor ejecuta la receta **en orden**:
   - A código fijo  
   - B sandbox (prueba segura)  
   - C a veces IA  
   - D guardar resultado  
8. El mesero trae la respuesta.  
9. La ventana pinta: listo / error.

**Conectar el backend** = decirle al mesero **dónde está la cocina**.

- Cocina en **tu PC** (local): el motor corre en el aparato.  
- Cocina en **la nube**: el motor manda un recado seguro a un servidor. La ventana no conoce la llave.  
- Las dos a la vez: un paso local, el siguiente en la nube.

Eso es todo. No hay magia en el botón.

## 4. La ventana y el code fuente del workflow

Cada ventana aprobada es **una habitación**.  
El workflow es **el plano eléctrico** de esa habitación.

- No mezclamos 39 habitaciones en un solo archivo.  
- El host es el pasillo que las une.  
- Si cambias el cable de un botón, cambias **solo esa receta**, no toda la casa.

## 5. Fábrica de UI (tú, no el usuario)

La fábrica es el taller donde **armas el menú**. El cliente no entra.

Qué haces ahí:

1. Eliges ventanas (CASCADE, chat, tren…).  
2. Eliges botones y se los pegas **arriba o abajo**.  
3. Les pones nombre (y luego idioma).  
4. Les pegas la **etiqueta de trabajo** (qué receta disparan).  
5. Dices si esa receta es local, nube, o mixta.  
6. Pruebas el botón **tú**.  
7. Cuando está bien: **cierras el taller** y sales un **paquete producto**.

En el paquete producto:

- Se ve la UI.  
- **No** se ve la fábrica.  
- **No** se ven llaves ni URLs.

## 6. Cómo corre en Linux, Windows, iOS, Android

La UI es **la misma** (el menú es el mismo papel).

Lo que cambia es **el marco**:

| Sistema | Marco | Motor |
|---------|-------|--------|
| Linux / Windows | Una ventanita nativa que abre ese HTML | Motor en el PC |
| Android / iOS | Una app que abre el mismo HTML por dentro | Motor en el teléfono o nube |
| Web | El navegador | Motor en servidor o local |

No fabricamos 4 UIs. Fabricamos **1 UI** + 4 marcos.

Orden de verdad:

1. Que la ventana funcione en un HTML (ya).  
2. Que el host una varias ventanas.  
3. Que el motor local ejecute recetas sin IA.  
4. Que un paso pueda ir a la nube.  
5. Recién ahí: envolver en Linux/Windows y luego Android/iOS.

## 7. Cómo lo armo (proceso)

1. Tú apruebas **una** ventana.  
2. Yo no invento funciones: copio las que ya tiene el HTML/workflow.  
3. Cada botón = etiqueta + receta.  
4. Lo pruebas.  
5. `OK` → queda en biblioteca producto (sin fábrica).  
6. Siguiente ventana.  
7. Al tener varias: el host las junta como Lego.  
8. Al tener el motor: los botones **de verdad** cocinan.  
9. Al final: marcos para cada sistema.

Hoy RUN-01 es el **menú CASCADE**. La cocina completa **aún no está metida en el aparato**. Por eso Run sin cocina dice “sin conexión” y no inventa comida.
