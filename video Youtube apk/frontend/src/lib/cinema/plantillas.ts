/** Plantillas que el modelo replica. El usuario no mueve la luz: entrega material y el código hace el plano. */

export type Engine = "grok" | "qwen" | "ffmpeg" | "youtube" | "montaje";

export interface Plantilla {
  id: string;
  name: string;
  engine: Engine;
  systemPrompt: string;
  code: string;
  ffmpegFilter: string | null;
}

export interface YoutubePack {
  status: "NOT_UPLOADED";
  reason: "NO_OAUTH";
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  chapters: string[];
  chaptersNote: string;
  thumbnail: string;
  pinned: string;
  category: string;
  language: "es";
  madeForKids: false;
  disclosure: string;
  hook: string;
}

const GROK_LAW =
  "Eres el director de una sola toma para Grok Imagine Video. Antes de escribir, fija deseo, obstáculo, geometría, mirada y ritmo. Prohibido: cinematic, epic, stunning, masterpiece, beautiful lighting, dynamic camera. No pidas al usuario que ajuste exposición ni color. Replica el código de la plantilla y sustituye solo el sujeto que vino en la referencia. Una toma, 6 segundos, 9:16, 480p, con sonido de sala. No afirmes que el video se publicó.";

const QWEN_LAW =
  "Eres el director que reescribe el encargo al formato Wan/Qwen. No cambies el sujeto ni la acción. Añade solo tiempo, fuente de luz, intensidad, ángulo, tamaño de plano y composición. Una línea de hechos. Sin adjetivos vacíos. El modelo de Qwen copia esa línea. No hay clave DashScope en esta sala: entrega el código, no finjas que Wan ya renderizó.";

const FFMPEG_LAW =
  "Ejecutas el filtergraph de esta plantilla con ffmpeg. No inventes otro filtro. No uses la shell. La entrada es el archivo que entregó el usuario o una toma del archivo. Salida de 8 segundos, H.264, audio a -14 LUFS si el normalizador corre. Si el filtro falla, dilo. No digas que corriste ACES, Blender ni USD.";

const YOUTUBE_LAW =
  "Preparas el paquete que el algoritmo de YouTube puede leer. No publiques. No hay OAuth: el estado es NOT_UPLOADED. Título menor de 70 caracteres, palabra del tema al inicio, sin mayúsculas gritadas. Las dos primeras líneas de la descripción dicen de qué trata. Capítulos solo si el corte dura al menos 60 segundos y hay tres marcas. Declara contenido generado o alterado con IA. Sin tags basura.";

const MONTAJE_LAW =
  "Escribes el corte como código, en el orden de los planos, con tiempos en milisegundos. No añadas un plano que no esté en la lista. El modelo replica este JSON. No reencuadres a mano.";

type GrokRow = readonly [string, string, string, string, string, string, string, string, string, string];

const GROK: GrokRow[] = [
  ["Empuje a la mesa", "leer el plano", "la lámpara tapa media hoja", "roble a la izquierda y pantalla a la derecha", "de la mano al planeta de alambre", "el avance dura toda la toma", "Slow push-in, 35mm, camera height locked", "Tungsten practical from a glass lamp, cool window fill from frame-right", "A hand slides paper toward a wireframe planet on a dark screen", "paper rustle and room tone, no score hit"],
  ["Perfil junto al vidrio", "mirar el reflejo sin girar la cabeza", "el reflejo parte la cara", "el cuerpo de perfil, el vidrio en el tercio derecho", "el ojo cae en el ojo reflejado", "la cámara no se mueve", "Locked profile, 50mm, eye level", "Soft window light from the left, dark room behind", "A person in a dark suit stands still beside a glass wall", "distant room tone, a single cloth shift"],
  ["Deriva del pasillo", "llegar a la escotilla", "el pasillo es más largo que el paso", "paredes de metal a ambos lados, luz al fondo", "el fondo tira del ojo", "la deriva es lenta y lateral", "Slow lateral drift, 24mm, waist height", "Cool practicals along the wall, one warm lamp at the far end", "The corridor slides past; a round hatch grows at the end", "footstep and ventilation, low"],
  ["Quieto en la escotilla", "no entrar todavía", "el marco de remaches corta el planeta", "escotilla redonda centrada", "el planeta queda en el centro del círculo", "siete segundos sin movimiento", "Locked-off, 40mm, centered porthole", "Dim cabin, planet light as the only fill", "A ringed planet holds still inside a riveted round window", "hull creak, no music"],
  ["Lámpara y esfera", "encender la esfera sin tocarla", "la esfera ya brilla y la mano duda", "esfera de vidrio sobre roble, sillón detrás", "la esfera es el único punto claro", "un ligero avance", "Very slow push, 50mm", "Warm practical inside the glass sphere, the rest of the room falls off", "A glass sphere glows on an oak floor; a chair sits out of focus", "a low electric hum"],
  ["Tres anillos", "contarlos", "la niebla esconde el tercero", "tres aros blancos en vertical, suelo de niebla", "de arriba hacia abajo", "la cámara baja un palmo", "Slow pedestal down, 35mm", "Soft overhead white light, fog at the floor", "Three white rings hang in fog; the lowest one is half hidden", "soft air, no melody"],
  ["Detalle del traje", "comprobar la costura", "el dedo tapa el hilo", "pecho en primer plano, fondo negro", "la costura, no la cara", "fijo", "Close-up, 85mm, locked", "Hard side light, thin rim on the shoulder", "Fingers check a seam on a charcoal suit", "cloth and a held breath"],
  ["Suelo de la sala", "encontrar la sombra de la lámpara", "la sombra se mueve más que el objeto", "suelo de roble, sombra larga", "la sombra entra por la izquierda", "paneo mínimo", "Low angle, 28mm, slight pan right", "Low warm lamp, long shadow", "A lamp shadow crosses oak boards", "wood tick"],
  ["Estante", "sacar un libro sin tirar los otros", "los lomos están apretados", "estante a la altura de los ojos", "el hueco que deja el libro", "la mano entra y sale", "Medium close-up, 40mm, locked", "Soft top light, warm", "A hand pulls one dark book from a tight shelf", "paper and a soft thud"],
  ["Planeta en la mesa", "comparar el globo con el plano", "el globo refleja la lámpara", "globo pequeño junto a una hoja", "del globo a la tinta", "empuje corto", "Short push-in, 50mm", "Mixed tungsten and a cool screen spill", "A small planet model sits beside an ink drawing", "room tone"],
  ["Anillo que cierra", "ver el cierre del aro", "el aro tapa su propia unión", "un solo aro blanco, niebla", "la unión del aro", "órbita muy corta", "Tiny arc right, 50mm", "Even soft light, white on white fog", "One white ring turns just enough to show its seam", "air"],
  ["Metal cercano", "leer una placa", "el reflejo del techo borra las letras", "placa de metal a un palmo", "las letras, no el reflejo", "fijo con un grado de inclinación", "Close-up, 65mm, slight dutch", "Hard top light, cool", "A metal plate with short engraved marks, not a logo", "metal tick"],
  ["Ventana de noche", "mirar afuera sin abrir", "el cristal devuelve la sala", "ventana grande, interior cálido, exterior azul", "el exterior gana al reflejo", "fijo", "Locked wide, 28mm", "Warm interior practicals against blue night outside", "A dark window holds both the room and a faint exterior", "quiet night room"],
  ["Sillón vacío", "esperar a quien no entra", "nadie cruza la puerta", "sillón en el tercio izquierdo, puerta al fondo", "la puerta cerrada", "la toma entera es espera", "Locked wide, 32mm", "One warm lamp, the rest dim", "An empty armchair faces a closed door", "clock-free room tone"],
  ["Aleja del puente", "dejar el plano atrás", "el puente se hace pequeño demasiado pronto", "figura de espaldas, pantalla grande", "la espalda, luego la pantalla", "retroceso lento", "Slow pull-back, 35mm", "Cool screen light on the shoulders, dark around", "A person in a dark suit steps back from a large display", "soft shoe on floor"],
  ["Niebla al cenit", "mirar arriba", "la niebla no deja ver el techo", "aros vistos desde abajo", "el aro más alto", "la cabeza de la cámara sube", "Slow tilt up, 24mm", "Soft white from above, fog", "Looking up through fog at the highest white ring", "windless air"],
  ["Pasillo en quietud", "decidir si avanzar", "el siguiente marco está oscuro", "pasillo, un marco de luz a media distancia", "ese marco", "sin viaje, solo un respiro", "Locked, 35mm", "One practical in the distance, foreground underexposed but still readable", "A metal hall waits; one lit frame sits halfway down", "vent"],
  ["Mano y anillo", "soltar el aro", "el aro pesa en dos dedos", "mano en primer plano, niebla detrás", "los dedos", "la mano se abre al final", "Close-up, 70mm", "Soft wrap light, cool", "Two fingers hold a small white ring, then open", "skin and a faint clink"],
  ["Reflejo en el casco", "ver quién está detrás", "el casco curva la sala", "casco oscuro sobre una mesa", "la curva del reflejo", "un avance de pocos centímetros", "Macro-ish close push, 80mm", "Single practical, hard highlight on the curve", "A dark helmet on a table mirrors a narrow slice of the room", "room tone"],
  ["Puerta de la sala", "no abrirla", "la manilla está a media altura y nadie la usa", "puerta de madera, luz por la rendija", "la rendija", "fijo", "Locked medium, 40mm", "Warm slit of light, door in shadow", "A closed wooden door leaks a thin warm line", "hallway hush"],
  ["Cubierta y línea", "seguir una línea del plano", "la línea se sale del papel", "plano sobre la mesa, línea de tinta hacia la pantalla", "la línea", "travelling corto a lo largo de la mesa", "Short lateral move, 35mm, table height", "Lamp from above-left, screen glow at the end of the line", "An ink line on paper points toward a glowing display", "paper"],
  ["Dos luces", "elegir cuál manda", "la fría y la cálida pesan igual", "cara a tres cuartos, ventana y lámpara", "el ojo más cercano", "fijo", "Close portrait, 65mm", "Cool window on one cheek, warm lamp on the other, neither crushed", "A face split by a cool side and a warm side", "breath"],
  ["Suelo del anillo", "apoyar el pie sin romper la niebla", "la niebla se abre alrededor del zapato", "suelo claro, niebla baja, zapato oscuro", "el zapato", "ligero tilt down", "Slight tilt down, 35mm", "Soft overcast light", "A dark shoe meets a pale floor and the fog parts", "cloth and floor"],
  ["Último marco", "cerrar la toma", "no hay otro plano después", "el sujeto centrado y pequeño", "el sujeto, luego el negro de los bordes", "retroceso que termina", "Pull-back that stops, 32mm", "Practical fading, edges darker, center still readable", "The subject stays centered while the room recedes", "room tone falling off"],
];

type QwenRow = readonly [string, string, string, string, string, string, string];

const QWEN: QwenRow[] = [
  ["Día en la mesa", "día", "luz de ventana", "suave", "lateral", "plano medio", "un ingeniero revisa un papel junto a una lámpara de vidrio"],
  ["Noche de escotilla", "noche", "luz del planeta", "dura", "frontal", "primer plano", "un planeta con anillos quieto dentro de una escotilla remachada"],
  ["Amanecer en el pasillo", "amanecer", "practical de pared", "suave", "lateral", "plano general", "un pasillo de metal con una sola luz al fondo"],
  ["Tarde del sillón", "tarde", "lámpara de pie", "suave", "tres cuartos", "plano medio", "un sillón vacío frente a una puerta cerrada"],
  ["Luna sobre los aros", "noche", "luz de luna", "dura", "cenital", "plano americano", "tres aros blancos colgados en niebla baja"],
  ["Interior con fluorescente", "día", "fluorescente", "suave", "cenital", "plano medio", "una mesa de trabajo y una pantalla apagada"],
  ["Fuego bajo", "noche", "fuego", "dura", "contraluz", "primer plano", "una mano cerca de una esfera de vidrio que brilla"],
  ["Nublado en el puente", "día", "luz de día nublado", "suave", "frontal", "plano general", "una figura de espaldas ante una pantalla grande"],
  ["Artificial fría", "noche", "luz artificial", "dura", "lateral", "primerísimo primer plano", "la costura de un traje oscuro"],
  ["Práctica cálida", "tarde", "luz práctica", "suave", "lateral", "plano detalle", "la sombra de una lámpara cruza un suelo de roble"],
  ["Ventana azul", "noche", "luz de ventana", "suave", "contraluz", "plano medio", "una ventana devuelve la sala y deja ver un exterior azul"],
  ["Cenital del estante", "día", "luz artificial", "suave", "cenital", "plano detalle", "una mano saca un libro de un estante apretado"],
  ["Lateral del casco", "noche", "practical", "dura", "lateral", "macro", "un casco oscuro refleja una franja de la sala"],
  ["Frontal de la placa", "día", "luz de día", "dura", "frontal", "primer plano", "una placa de metal con marcas cortas, sin logotipo"],
  ["Contraluz de la puerta", "tarde", "luz de rendija", "dura", "contraluz", "plano medio", "una puerta de madera cerrada con una línea de luz"],
  ["Suave en la niebla", "amanecer", "luz de día", "suave", "frontal", "plano general", "niebla a la altura del tobillo y un aro blanco"],
  ["Duro en el metal", "día", "luz artificial", "dura", "cenital", "plano detalle", "remaches alrededor de una escotilla"],
  ["Tres cuartos del perfil", "tarde", "luz de ventana", "suave", "tres cuartos", "primer plano", "un perfil junto a un vidrio"],
  ["General del puente", "noche", "luz de pantalla", "suave", "frontal", "gran plano general", "una sala oscura y una pantalla con un planeta de alambre"],
  ["Detalle del papel", "día", "luz de lámpara", "suave", "cenital", "plano detalle", "tinta sobre papel, una línea que sale del borde"],
  ["Americano de la espera", "noche", "practical", "suave", "lateral", "plano americano", "una persona quieta a medio camino de un pasillo"],
  ["Picado del suelo", "día", "luz de día", "suave", "cenital", "plano picado", "un zapato oscuro sobre suelo claro"],
  ["Contrapicado del aro", "noche", "luna", "dura", "contrapicado", "contrapicado", "un aro blanco visto desde el suelo"],
  ["Medio de la decisión", "atardecer", "mixta", "suave", "lateral", "plano medio", "alguien se detiene antes de apoyar la mano en una puerta"],
];

const FFMPEG: readonly (readonly [string, string])[] = [
  ["Crop de empuje", "crop=640:1140:x='16+12*t':y='70',scale=720:1280:flags=lanczos,eq=contrast=1.04:saturation=0.96"],
  ["Deriva lateral", "crop=640:1140:x='80-10*t':y='70',scale=720:1280:flags=lanczos,eq=saturation=0.94"],
  ["Toma fija", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=contrast=1.02:saturation=0.98"],
  ["Luz fría", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=gamma=1.02:saturation=0.9:gamma_r=0.94:gamma_b=1.08"],
  ["Luz cálida", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=saturation=1.02:gamma_r=1.08:gamma_b=0.94"],
  ["Luz suave", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=contrast=0.92:saturation=0.9:brightness=0.02"],
  ["Borde", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=contrast=1.12:saturation=0.88:gamma_b=1.06"],
  ["Viñeta corta", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,vignette=PI/5"],
  ["Grano leve", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,noise=alls=4:allf=t"],
  ["Entrada en negro", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fade=t=in:st=0:d=0.4"],
  ["Salida a negro", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fade=t=out:st=7.4:d=0.6"],
  ["Nitidez de placa", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,unsharp=5:5:0.35"],
  ["Noche legible", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=brightness=-0.04:contrast=1.08:saturation=0.86"],
  ["Día abierto", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=brightness=0.03:contrast=1.02:saturation=0.98"],
  ["Tilt mínimo", "crop=660:1160:x='30':y='40+8*t',scale=720:1280:flags=lanczos"],
  ["Retroceso", "crop=700:1200:x='10+6*t':y='40+4*t',scale=720:1280:flags=lanczos,eq=contrast=1.03"],
  ["Split frío-cálido", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,colorbalance=rs=0.04:bs=0.06:gm=0.02"],
  ["Piel sin plástico", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=saturation=0.92:gamma=1.04:contrast=1.01"],
  ["Metal", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=contrast=1.1:saturation=0.8:gamma=0.98"],
  ["Niebla alta clave", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=brightness=0.04:contrast=0.9:saturation=0.85"],
  ["Peso del grave visual", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=gamma=0.96:contrast=1.06:saturation=0.9"],
  ["Corte seco de luz", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,eq=brightness=0.01:contrast=1.15:saturation=0.94"],
];

const YOUTUBE: readonly (readonly [string, string])[] = [
  ["Tema al inicio del título", "El título empieza por el objeto del plano, no por un adjetivo. Menos de 70 caracteres."],
  ["Promesa en dos líneas", "Las dos primeras líneas dicen qué se ve y por qué importa para YAIWES. El resto puede esperar."],
  ["Capítulos solo si hay minuto", "No inventes capítulos en un plano de seis segundos. Anótalo para cuando el corte llegue a sesenta."],
  ["Miniatura de una sola cosa", "Una cosa grande en la miniatura. Tres palabras como máximo. No repitas el título entero."],
  ["Tres hashtags", "Exactamente tres hashtags al final de la descripción. Ni cero ni diez."],
  ["Pregunta fijada", "El comentario fijado es una pregunta concreta sobre el siguiente plano, no un saludo."],
  ["Categoría de ciencia", "Categoría Ciencia y tecnología. El canal explica la AGI YAIWES, no un entretenimiento genérico."],
  ["Idioma declarado", "Idioma es español. Si la voz del archivo es inglesa, dilo en la segunda línea, no cambies el idioma del paquete."],
  ["Sin niños", "madeForKids es falso. No uses vocabulario de contenido infantil."],
  ["Declaración de IA", "La descripción cierra con la frase de contenido generado o alterado con IA. No la escondas."],
  ["Gancho de los primeros segundos", "Escribe qué debe entender quien no pasa de los tres primeros segundos."],
  ["Tags concretos", "Entre cinco y ocho tags. Cada uno nombra algo que sí está en el plano. Nada de 'viral'."],
  ["Fin de pantalla", "Si el corte dura más de veinte segundos, reserva los últimos quince para una pantalla final. Si no, no la prometas."],
  ["Tarjetas en el cambio", "Una tarjeta solo en un cambio de plano real. En una toma única, ninguna."],
  ["Lista del canal", "Sugiere la lista 'Planos YAIWES', no una lista que no existe con otro nombre."],
  ["Descripción sin relleno", "Prohibido 'no olvides suscribirte' en las dos primeras líneas. Puede ir después de los capítulos, una sola vez."],
  ["Título sin clickbait", "No uses signos de exclamación ni 'nadie te cuenta'. El título es una etiqueta del plano."],
  ["Palabra de búsqueda", "Incluye 'YAIWES' una vez en el título o en la primera línea, no en las dos."],
  ["Subtítulos", "Pide subtítulos automáticos y una línea de lo que diría la voz, sin inventar un diálogo de película."],
  ["Privacidad", "Privacidad privada hasta que haya OAuth. El estado escrito es NOT_UPLOADED."],
  ["Duración honesta", "Escribe la duración real del archivo que salió, no la duración soñada."],
  ["Enlace de referencia", "Si la fuente fue un URL de YouTube, cítalo como referencia visual. No digas que es el mismo video."],
];

const MONTAJE: readonly (readonly [string, string, string])[] = [
  ["Tres golpes", "2500,2000,3500", "establecimiento,detalle,salida"],
  ["Espera larga", "5000,1500,1500", "quietud,gesto,corte"],
  ["Detalle primero", "1500,2500,4000", "detalle,contexto,alejamiento"],
  ["Puerta", "2000,4000,2000", "approach,hold,decision"],
  ["Anillos", "2000,2000,2000,2000", "aro alto,aro medio,aro bajo,cenit"],
  ["Mesa", "3000,2000,3000", "papel,mano,pantalla"],
  ["Pasillo", "4000,2000,2000", "fondo,paso,escotilla"],
  ["Luz práctica", "2000,5000,1000", "apagado,encendido,sostenido"],
  ["Reflejo", "3000,3000,2000", "cara,vidrio,vuelta"],
  ["Suelo", "2000,2000,4000", "sombra,objeto,quietud"],
  ["Cuatro iguales", "2000,2000,2000,2000", "norte,este,sur,oeste"],
  ["Insert", "4000,800,3200", "accion,insert,accion"],
  ["J de sonido", "0,3000,5000", "audio entra antes,plano,resolucion"],
  ["L de sonido", "4000,4000,0", "plano,audio queda,corte a negro"],
  ["Match", "3000,3000", "forma A,forma B"],
  ["Montaje de medida", "2000,1500,1500,3000", "ancho,medio,cerca,ancho"],
  ["Una sola", "8000", "plano único"],
  ["Cierre", "3000,3000,2000", "accion,reaccion,negro"],
];

function pad(index: number): string {
  return `pt-${String(index).padStart(3, "0")}`;
}

function grokPlantilla(row: GrokRow, index: number): Plantilla {
  const [name, desire, obstacle, geometry, gaze, rhythm, camera, light, action, sound] = row;
  const code = [
    `deseo: ${desire}`,
    `obstáculo: ${obstacle}`,
    `geometría: ${geometry}`,
    `mirada: ${gaze}`,
    `ritmo: ${rhythm}`,
    "PROMPT:",
    `${camera}. ${light}. ${action}. Sound: ${sound}. One shot, 6 seconds, 9:16, 480p, no on-screen text, no logos.`,
  ].join("\n");
  return { id: pad(index), name, engine: "grok", systemPrompt: GROK_LAW, code, ffmpegFilter: null };
}

function qwenPlantilla(row: QwenRow, index: number): Plantilla {
  const [name, time, source, intensity, angle, size, subject] = row;
  const code = `${time}, ${source}, ${intensity}, ${angle}, ${size}. ${subject}. Sin texto en pantalla.`;
  return { id: pad(index), name, engine: "qwen", systemPrompt: QWEN_LAW, code, ffmpegFilter: null };
}

function ffmpegPlantilla(row: readonly [string, string], index: number): Plantilla {
  const [name, filter] = row;
  const code = `ffmpeg -y -ss 2 -t 8 -i ENTRADA -vf "${filter}" -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart SALIDA`;
  return { id: pad(index), name, engine: "ffmpeg", systemPrompt: FFMPEG_LAW, code, ffmpegFilter: filter };
}

function youtubePlantilla(row: readonly [string, string], index: number): Plantilla {
  const [name, rule] = row;
  const code = [
    "status: NOT_UPLOADED",
    "reason: NO_OAUTH",
    `regla: ${rule}`,
    "title: <70 caracteres, tema primero>",
    "description: línea 1 promesa. línea 2 qué se ve. capítulos si dura >= 60s. disclosure de IA. 3 hashtags.",
    "tags: 5 a 8, concretos",
    "category: Ciencia y tecnología",
    "madeForKids: false",
    "privacy: private",
  ].join("\n");
  return { id: pad(index), name, engine: "youtube", systemPrompt: YOUTUBE_LAW, code, ffmpegFilter: null };
}

function montajePlantilla(row: readonly [string, string, string], index: number): Plantilla {
  const [name, times, shots] = row;
  const ms = times.split(",").map((item) => Number(item));
  const names = shots.split(",");
  let at = 0;
  const cuts = names.map((shot, shotIndex) => {
    const use = ms[shotIndex] ?? ms[ms.length - 1] ?? 2000;
    const cut = { at, shot, ms: use };
    at += use;
    return cut;
  });
  const code = JSON.stringify({ name, cuts }, null, 2);
  return { id: pad(index), name, engine: "montaje", systemPrompt: MONTAJE_LAW, code, ffmpegFilter: null };
}

function build(): Plantilla[] {
  const rows: Plantilla[] = [];
  let cursor = 1;
  for (const row of GROK) rows.push(grokPlantilla(row, cursor++));
  for (const row of QWEN) rows.push(qwenPlantilla(row, cursor++));
  for (const row of FFMPEG) rows.push(ffmpegPlantilla(row, cursor++));
  for (const row of YOUTUBE) rows.push(youtubePlantilla(row, cursor++));
  for (const row of MONTAJE) rows.push(montajePlantilla(row, cursor++));
  return rows;
}

export const PLANTILLAS: Plantilla[] = build();

export function plantillaById(id: string): Plantilla | undefined {
  return PLANTILLAS.find((item) => item.id === id);
}

export function pickPlantilla(key: string, engine: Engine): Plantilla {
  const pool = PLANTILLAS.filter((item) => item.engine === engine);
  let hash = 0;
  for (const char of key) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return pool[hash % pool.length] ?? PLANTILLAS[0];
}

export function youtubePack(sourceTitle: string, plantillaName: string, referenceUrl: string | null): YoutubePack {
  const clean = sourceTitle.replace(/\s+/g, " ").trim().slice(0, 80) || plantillaName;
  const title = `YAIWES: ${clean}`.slice(0, 70);
  const hook = `${clean} es el plano que la plantilla «${plantillaName}» le ordena replicar al modelo.`;
  const hashtags = ["#YAIWES", "#MaxbryAGI", "#VideoConIA"];
  const description = [
    hook,
    "Se ve el material que entregaste, tratado por el código de esa plantilla, no por un ajuste manual.",
    "",
    "Capítulos",
    "0:00 Plano",
    "",
    "Lista: Planos YAIWES.",
    referenceUrl ? `Referencia visible: ${referenceUrl}` : "Referencia: archivo de la sala.",
    "Contenido generado o alterado con IA.",
    hashtags.join(" "),
  ].join("\n");
  return {
    status: "NOT_UPLOADED",
    reason: "NO_OAUTH",
    title,
    description,
    tags: ["YAIWES", "Maxbry AGI", "inteligencia artificial", "video con IA", plantillaName.slice(0, 40), "AGI"].slice(0, 8),
    hashtags,
    chapters: ["0:00 Plano"],
    chaptersNote: "YouTube solo muestra capítulos con tres marcas o más en un video de al menos 60 segundos. Un plano corto no los activa.",
    thumbnail: "Una sola cosa grande del plano. Tres palabras como máximo. No repitas el título.",
    pinned: "¿Qué material debe replicar el modelo en el siguiente plano?",
    category: "Ciencia y tecnología",
    language: "es",
    madeForKids: false,
    disclosure: "Contenido generado o alterado con IA. No está publicado.",
    hook,
  };
}
