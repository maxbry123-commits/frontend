export interface FitPiece {
  sequenceIndex: number;
  id: string;
  sourceMs: number;
  useMs: number;
  trimMs: number;
}

export interface LibraryFilm {
  id: string;
  module: "reel" | "land";
  title: string;
  agentId: string;
  language: string;
  voice: string;
  targetMs: number;
  measuredDurationMs: number;
  width: number;
  height: number;
  src: string;
  verifiedExport: boolean;
  template?: boolean;
  pieces: FitPiece[];
}

export interface CinemaLibrary {
  version: number;
  skill: string;
  routerExternal: string;
  mcpPath: string;
  httpPath?: string;
  blender?: string;
  aces?: string;
  youtube?: string;
  films: LibraryFilm[];
}
