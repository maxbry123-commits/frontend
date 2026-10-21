export const VERSION = "v6";

export const VERSIONES: { id: string; note: string }[] = [
  {
    id: "v6",
    note: "El reproductor 16:9 elige entre los horizontales del archivo. Solo land-01 tiene decodificación completa de 300.000 ms.",
  },
  {
    id: "v5",
    note: "reel-59 es un recorte del original de 60 s: 59.000 ms, 720×1280, 30 fps. El original no se borró. Sigue sin haber 600.000 ms.",
  },
  {
    id: "v4",
    note: "Dos reproductores en la sala. La cola mide el MP4 importado y lo guarda en IndexedDB. land-01 decodifica 300.000 ms. No hay 59.000 ni 600.000 ms.",
  },
  {
    id: "v3",
    note: "La partitura baja solo con el motor: 10 skills y 8 sistemas nuevos, más Motion Canvas y Revideo. Hermes dirige y no corre en el teléfono. La APK no está compilada.",
  },
  {
    id: "v2",
    note: "Motion Canvas y Revideo cerraron con el motor. HyperFrames y Remotion no se instalaron. YouTube no se publica.",
  },
  {
    id: "v1",
    note: "El modelo replica el código de una plantilla. Tú solo entregas imagen, enlace de YouTube o una toma del archivo. El paquete de YouTube queda listo y no se publica.",
  },
];