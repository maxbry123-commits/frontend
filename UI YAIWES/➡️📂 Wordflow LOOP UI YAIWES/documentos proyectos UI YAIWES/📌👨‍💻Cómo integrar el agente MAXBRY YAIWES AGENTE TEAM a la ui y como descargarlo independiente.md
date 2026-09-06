Cómo integrar el agente MAXBRY YAIWES AGENTE TEAM a la ui y como descargarlo independiente 

Salida 1/4 — Contrato JSON + JSON Schema

Esta salida define qué es el agente, de dónde sale, los dos modos de distribución y las reglas que deben obedecer el DSL/DAG/Sheriff. No incluye todavía el exportador Python ni el DAG ejecutable; eso queda para las siguientes salidas.

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.invalid/schemas/agent-distribution.v1.json",
  "title": "Deterministic Agent Distribution Contract",
  "description": "Contrato determinista para extraer un agente desde un repositorio Git y distribuirlo como paquete independiente o embebido dentro de una UI.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema",
    "contract_version",
    "agent",
    "source",
    "distribution",
    "verification",
    "runtime"
  ],
  "properties": {
    "schema": {
      "type": "string",
      "const": "agent-distribution"
    },
    "contract_version": {
      "type": "string",
      "const": "1.0.0"
    },

    "agent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "name",
        "version"
      ],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z0-9][a-z0-9._-]*$"
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "version": {
          "type": "string",
          "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
        },
        "description": {
          "type": "string"
        }
      }
    },

    "source": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "provider",
        "repository",
        "commit"
      ],
      "properties": {
        "provider": {
          "type": "string",
          "const": "github"
        },
        "owner": {
          "type": "string",
          "minLength": 1
        },
        "repository": {
          "type": "string",
          "minLength": 1
        },
        "commit": {
          "type": "string",
          "description": "Commit SHA inmutable que constituye la fuente exacta.",
          "pattern": "^[0-9a-fA-F]{40}$"
        },
        "tag": {
          "type": [
            "string",
            "null"
          ]
        },
        "branch": {
          "type": [
            "string",
            "null"
          ]
        },
        "allow_latest": {
          "type": "boolean",
          "const": false
        },
        "include_git_history": {
          "type": "boolean",
          "const": false
        }
      }
    },

    "distribution": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "modes",
        "default_mode"
      ],
      "properties": {
        "modes": {
          "type": "array",
          "uniqueItems": true,
          "minItems": 1,
          "items": {
            "type": "string",
            "enum": [
              "DOWNLOAD_AGENT",
              "EMBED_AGENT"
            ]
          }
        },
        "default_mode": {
          "type": "string",
          "enum": [
            "DOWNLOAD_AGENT",
            "EMBED_AGENT"
          ]
        },

        "download_agent": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "enabled",
            "artifact"
          ],
          "properties": {
            "enabled": {
              "type": "boolean"
            },
            "artifact": {
              "type": "string",
              "pattern": "^[a-zA-Z0-9._-]+\\.zip$"
            },
            "format": {
              "type": "string",
              "const": "zip"
            }
          }
        },

        "embed_agent": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "enabled",
            "root"
          ],
          "properties": {
            "enabled": {
              "type": "boolean"
            },
            "root": {
              "type": "string",
              "minLength": 1
            },
            "package_inside_ui": {
              "type": "boolean",
              "const": true
            }
          }
        }
      }
    },

    "verification": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "deterministic",
        "inventory",
        "sha256",
        "fail_closed"
      ],
      "properties": {
        "deterministic": {
          "type": "boolean",
          "const": true
        },
        "inventory": {
          "type": "boolean",
          "const": true
        },
        "sha256": {
          "type": "boolean",
          "const": true
        },
        "git_object_verification": {
          "type": "boolean",
          "const": true
        },
        "fail_closed": {
          "type": "boolean",
          "const": true
        },
        "reject_partial_export": {
          "type": "boolean",
          "const": true
        },
        "reject_unexpected_files": {
          "type": "boolean",
          "const": true
        }
      }
    },

    "runtime": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "platforms"
      ],
      "properties": {
        "platforms": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "windows",
              "linux",
              "macos",
              "android",
              "ios",
              "web"
            ]
          }
        },
        "runtime_required": {
          "type": [
            "string",
            "null"
          ]
        },
        "runtime_version": {
          "type": [
            "string",
            "null"
          ]
        }
      }
    },

    "layout": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "agent_root": {
          "type": "string",
          "default": "agent"
        },
        "required_directories": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "excluded_paths": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        }
      }
    },

    "dependencies": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "required": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "name",
              "version"
            ],
            "properties": {
              "name": {
                "type": "string"
              },
              "version": {
                "type": "string"
              }
            }
          }
        },
        "external": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "name",
              "type"
            ],
            "properties": {
              "name": {
                "type": "string"
              },
              "type": {
                "type": "string",
                "enum": [
                  "model",
                  "api",
                  "service",
                  "runtime",
                  "dataset",
                  "other"
                ]
              },
              "required_for_start": {
                "type": "boolean"
              }
            }
          }
        }
      }
    },

    "artifacts": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "source_archive": {
          "type": "string"
        },
        "manifest": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        }
      }
    }
  },

  "allOf": [
    {
      "if": {
        "properties": {
          "distribution": {
            "properties": {
              "modes": {
                "contains": {
                  "const": "DOWNLOAD_AGENT"
                }
              }
            }
          }
        }
      },
      "then": {
        "properties": {
          "distribution": {
            "required": [
              "download_agent"
            ]
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "distribution": {
            "properties": {
              "modes": {
                "contains": {
                  "const": "EMBED_AGENT"
                }
              }
            }
          }
        }
      },
      "then": {
        "properties": {
          "distribution": {
            "required": [
              "embed_agent"
            ]
          }
        }
      }
    }
  ]
}

Archivo de configuración real

El Schema anterior define las reglas. Este es el JSON que utilizaría tu proyecto:

{
  "$schema": "./schemas/agent-distribution.v1.schema.json",
  "schema": "agent-distribution",
  "contract_version": "1.0.0",

  "agent": {
    "id": "team-agent",
    "name": "TEAM Agent",
    "version": "1.0.0",
    "description": "Portable TEAM agent"
  },

  "source": {
    "provider": "github",
    "owner": "TU_USUARIO",
    "repository": "TU_REPO",
    "commit": "0000000000000000000000000000000000000000",
    "tag": null,
    "branch": null,
    "allow_latest": false,
    "include_git_history": false
  },

  "distribution": {
    "modes": [
      "DOWNLOAD_AGENT",
      "EMBED_AGENT"
    ],

    "default_mode": "DOWNLOAD_AGENT",

    "download_agent": {
      "enabled": true,
      "artifact": "TEAM-Agent-v1.0.0.zip",
      "format": "zip"
    },

    "embed_agent": {
      "enabled": true,
      "root": "agent",
      "package_inside_ui": true
    }
  },

  "verification": {
    "deterministic": true,
    "inventory": true,
    "sha256": true,
    "git_object_verification": true,
    "fail_closed": true,
    "reject_partial_export": true,
    "reject_unexpected_files": true
  },

  "runtime": {
    "platforms": [
      "windows",
      "linux",
      "macos",
      "android",
      "web"
    ],
    "runtime_required": null,
    "runtime_version": null
  },

  "layout": {
    "agent_root": "agent",

    "required_directories": [
      "agent"
    ],

    "excluded_paths": [
      ".git",
      ".github/workflows",
      ".cache",
      "__pycache__",
      "node_modules",
      "tmp",
      "logs"
    ]
  },

  "dependencies": {
    "required": [],
    "external": []
  },

  "artifacts": {
    "source_archive": "TEAM-Agent-v1.0.0.zip",
    "manifest": "TEAM-Agent-v1.0.0.manifest.json",
    "checksum": "TEAM-Agent-v1.0.0.sha256"
  }
}

Regla fundamental de esta salida

El mismo contrato permite los dos escenarios:

DOWNLOAD_AGENT
    ↓
TEAM-Agent-v1.0.0.zip

o:

EMBED_AGENT
    ↓
TU-UI/
└── agent/
    └── [copia verificada del agente]

Y, si ambos están habilitados:

DOWNLOAD_AGENT + EMBED_AGENT

no son dos agentes diferentes: ambos deben proceder del mismo source.commit y del mismo inventario congelado. Eso será una regla del DSL/Sheriff en la Salida 2.


Salida 2/4 — DSL + DAG determinista

Esta salida toma el contrato JSON de la Salida 1 y define cómo se ejecutan los dos modos. El mismo commit e inventario deben alimentar DOWNLOAD_AGENT y EMBED_AGENT.

# ============================================================
# TEAM AGENT DISTRIBUTION DSL
# OUTPUT 2 / 4
# DSL + DAG + SHERIFF
# ============================================================

DSL_VERSION = "1.0.0"
SCHEMA = "agent-distribution"
CONTRACT_VERSION = "1.0.0"

# ============================================================
# SOURCE
# ============================================================

SOURCE {

    PROVIDER = "github"

    OWNER = CONFIG.source.owner

    REPOSITORY = CONFIG.source.repository

    COMMIT = CONFIG.source.commit

    REQUIRE_COMMIT_SHA = true

    ALLOW_BRANCH = false

    ALLOW_LATEST = false

    INCLUDE_GIT_HISTORY = false
}

# ============================================================
# DETERMINISTIC RULE
# ============================================================

DETERMINISM {

    SOURCE_ID =
        SHA256(
            PROVIDER
            + ":"
            + OWNER
            + "/"
            + REPOSITORY
            + "@"
            + COMMIT
        )

    SAME_SOURCE_ID
        MUST_PRODUCE_SAME_INVENTORY = true

    SAME_INVENTORY
        MUST_PRODUCE_SAME_PLAN = true

    SAME_PLAN
        MUST_PRODUCE_SAME_ARTIFACT = true
}

# ============================================================
# INVENTORY
# ============================================================

INVENTORY {

    DISCOVER = true

    NORMALIZE_PATHS = true

    SORT = "PATH_ASC"

    REJECT_DUPLICATES = true

    REJECT_INVALID_PATHS = true

    REJECT_PATH_TRAVERSAL = true

    REJECT_ABSOLUTE_PATHS = true

    INCLUDE {

        PATH

        TYPE

        MODE

        SIZE

        GIT_SHA

    }

    FREEZE = true

    HASH = "SHA256_CANONICAL"
}

# ============================================================
# AGENT CONTENT
# ============================================================

AGENT_CONTENT {

    ROOT = CONFIG.layout.agent_root

    EXCLUDE {

        ".git"

        ".cache"

        "__pycache__"

        "node_modules"

        "tmp"

        "logs"
    }

    REQUIRED = CONFIG.layout.required_directories
}

# ============================================================
# TWO DISTRIBUTION MODES
# ============================================================

MODE DOWNLOAD_AGENT {

    ENABLED =
        CONFIG.distribution.download_agent.enabled

    FORMAT = "zip"

    OUTPUT =
        CONFIG.distribution.download_agent.artifact

    SOURCE = FROZEN_INVENTORY

    VERIFY_BEFORE_OUTPUT = true
}

MODE EMBED_AGENT {

    ENABLED =
        CONFIG.distribution.embed_agent.enabled

    ROOT =
        CONFIG.distribution.embed_agent.root

    PACKAGE_INSIDE_UI = true

    SOURCE = FROZEN_INVENTORY

    VERIFY_BEFORE_OUTPUT = true
}

# ============================================================
# CRITICAL RULE
#
# BOTH MODES MUST USE THE SAME FROZEN SOURCE
# ============================================================

DISTRIBUTION {

    SOURCE = FROZEN_SOURCE

    INVENTORY = FROZEN_INVENTORY

    PLAN = FROZEN_PLAN

    DOWNLOAD_AGENT.SOURCE_ID
        == EMBED_AGENT.SOURCE_ID

    DOWNLOAD_AGENT.INVENTORY_HASH
        == EMBED_AGENT.INVENTORY_HASH

    DOWNLOAD_AGENT.PLAN_HASH
        == EMBED_AGENT.PLAN_HASH
}

# ============================================================
# DAG
# ============================================================

DAG TEAM_AGENT_EXPORT {

    NODE VALIDATE_CONFIG {

        ACTION = VALIDATE_SCHEMA

        INPUT = CONFIG

        ON_SUCCESS = LOCK_SOURCE

        ON_FAILURE = STOP
    }


    NODE LOCK_SOURCE {

        ACTION = RESOLVE_SOURCE

        INPUT = CONFIG.source

        REQUIRE = COMMIT_SHA

        ON_SUCCESS = VERIFY_SOURCE

        ON_FAILURE = STOP
    }


    NODE VERIFY_SOURCE {

        ACTION = VERIFY_COMMIT

        INPUT = LOCK_SOURCE

        REQUIRE {

            PROVIDER == "github"

            COMMIT_IS_40_HEX = true

            BRANCH_NOT_USED = true

            LATEST_NOT_USED = true
        }

        ON_SUCCESS = DISCOVER_TREE

        ON_FAILURE = STOP
    }


    NODE DISCOVER_TREE {

        ACTION = DISCOVER_COMPLETE_TREE

        INPUT = LOCK_SOURCE

        RECURSIVE = true

        IF_TRUNCATED = WALK_SUBTREES

        REQUIRE_COMPLETE = true

        ON_SUCCESS = BUILD_INVENTORY

        ON_FAILURE = STOP
    }


    NODE BUILD_INVENTORY {

        ACTION = CREATE_CANONICAL_INVENTORY

        INPUT = DISCOVER_TREE

        FILTER = AGENT_CONTENT

        SORT = PATH_ASC

        HASH = SHA256_CANONICAL

        ON_SUCCESS = FREEZE_INVENTORY

        ON_FAILURE = STOP
    }


    NODE FREEZE_INVENTORY {

        ACTION = FREEZE

        INPUT = BUILD_INVENTORY

        OUTPUT {

            INVENTORY

            INVENTORY_HASH
        }

        ON_SUCCESS = BUILD_PLAN

        ON_FAILURE = STOP
    }


    NODE BUILD_PLAN {

        ACTION = CREATE_DETERMINISTIC_PLAN

        INPUT {

            SOURCE

            INVENTORY
        }

        ORDER = PATH_ASC

        ON_SUCCESS = FREEZE_PLAN

        ON_FAILURE = STOP
    }


    NODE FREEZE_PLAN {

        ACTION = FREEZE

        INPUT = BUILD_PLAN

        OUTPUT {

            PLAN

            PLAN_HASH
        }

        ON_SUCCESS = DESTINATION_CHECK

        ON_FAILURE = STOP
    }


    NODE DESTINATION_CHECK {

        ACTION = VALIDATE_DESTINATIONS

        INPUT = CONFIG.distribution

        CHECK {

            DOWNLOAD_AGENT

            EMBED_AGENT
        }

        ON_SUCCESS = CREATE_STAGING

        ON_FAILURE = STOP
    }


    NODE CREATE_STAGING {

        ACTION = CREATE_EMPTY_STAGING

        REQUIRE = NO_PARTIAL_OUTPUT

        ON_SUCCESS = ACQUIRE

        ON_FAILURE = STOP
    }


    NODE ACQUIRE {

        ACTION = ACQUIRE_FILES

        INPUT = FROZEN_PLAN

        ORDER = PATH_ASC

        VERIFY_SIZE = true

        VERIFY_GIT_SHA = true

        ON_SUCCESS = VERIFY_SOURCE_TREE

        ON_FAILURE = STOP
    }


    NODE VERIFY_SOURCE_TREE {

        ACTION = VERIFY_COMPLETE_TREE

        INPUT = STAGING

        REQUIRE {

            EVERY_EXPECTED_FILE_PRESENT

            NO_UNEXPECTED_FILES

            ALL_SIZES_MATCH

            ALL_GIT_SHAS_MATCH
        }

        ON_SUCCESS = VERIFY_INVENTORY

        ON_FAILURE = STOP
    }


    NODE VERIFY_INVENTORY {

        ACTION = REBUILD_AND_COMPARE_INVENTORY

        INPUT = STAGING

        EXPECTED = FROZEN_INVENTORY

        ON_SUCCESS = GENERATE_MANIFEST

        ON_FAILURE = STOP
    }


    NODE GENERATE_MANIFEST {

        ACTION = WRITE_MANIFEST

        INPUT {

            SOURCE

            INVENTORY_HASH

            PLAN_HASH

        }

        ON_SUCCESS = PACKAGE_DOWNLOAD

        ON_FAILURE = STOP
    }


    NODE PACKAGE_DOWNLOAD {

        CONDITION =
            MODE_ENABLED("DOWNLOAD_AGENT")

        ACTION = CREATE_DETERMINISTIC_ZIP

        INPUT = STAGING

        OUTPUT =
            CONFIG.distribution.download_agent.artifact

        REQUIRE {

            SORTED_ENTRIES

            NORMALIZED_METADATA

            FROZEN_INVENTORY
        }

        ON_SUCCESS = VERIFY_DOWNLOAD

        ON_FAILURE = STOP
    }


    NODE VERIFY_DOWNLOAD {

        CONDITION =
            MODE_ENABLED("DOWNLOAD_AGENT")

        ACTION = VERIFY_ARTIFACT

        INPUT {

            PACKAGE_DOWNLOAD

            MANIFEST
        }

        REQUIRE = SHA256_MATCH

        ON_SUCCESS = PREPARE_EMBED

        ON_FAILURE = STOP
    }


    NODE PREPARE_EMBED {

        CONDITION =
            MODE_ENABLED("EMBED_AGENT")

        ACTION = PREPARE_UI_AGENT_ROOT

        ROOT =
            CONFIG.distribution.embed_agent.root

        ON_SUCCESS = COPY_TO_UI

        ON_FAILURE = STOP
    }


    NODE COPY_TO_UI {

        CONDITION =
            MODE_ENABLED("EMBED_AGENT")

        ACTION = COPY_VERIFIED_TREE

        SOURCE = STAGING

        DESTINATION =
            CONFIG.distribution.embed_agent.root

        REQUIRE {

            DESTINATION_EMPTY_OR_CONTROLLED

            NO_UNEXPECTED_SOURCE_FILES

        }

        ON_SUCCESS = VERIFY_EMBED

        ON_FAILURE = STOP
    }


    NODE VERIFY_EMBED {

        CONDITION =
            MODE_ENABLED("EMBED_AGENT")

        ACTION = VERIFY_EMBEDDED_AGENT

        INPUT =
            CONFIG.distribution.embed_agent.root

        EXPECTED = FROZEN_INVENTORY

        ON_SUCCESS = PACKAGE_UI

        ON_FAILURE = STOP
    }


    NODE PACKAGE_UI {

        CONDITION =
            MODE_ENABLED("EMBED_AGENT")

        ACTION = CREATE_UI_ARTIFACT

        INPUT = VERIFIED_UI

        ON_SUCCESS = VERIFY_UI

        ON_FAILURE = STOP
    }


    NODE VERIFY_UI {

        CONDITION =
            MODE_ENABLED("EMBED_AGENT")

        ACTION = VERIFY_UI_ARTIFACT

        REQUIRE {

            EMBEDDED_AGENT_PRESENT

            EMBEDDED_AGENT_VERIFIED

            SOURCE_ID_MATCH

            INVENTORY_HASH_MATCH
        }

        ON_SUCCESS = FINAL_MANIFEST

        ON_FAILURE = STOP
    }


    NODE FINAL_MANIFEST {

        ACTION = WRITE_FINAL_MANIFEST

        INPUT {

            SOURCE_ID

            INVENTORY_HASH

            PLAN_HASH

            DOWNLOAD_ARTIFACT

            EMBEDDED_ARTIFACT
        }

        ON_SUCCESS = COMPLETE

        ON_FAILURE = STOP
    }


    NODE COMPLETE {

        ACTION = FINALIZE

        REQUIRE {

            NO_FAILURE

            SOURCE_LOCKED

            INVENTORY_FROZEN

            PLAN_FROZEN

            OUTPUTS_VERIFIED
        }

        STATE = COMPLETE
    }
}

# ============================================================
# SHERIFF
# ============================================================

SHERIFF {

    # SOURCE

    IF_COMMIT_MISSING
        STOP("SOURCE_COMMIT_REQUIRED")

    IF_COMMIT_INVALID
        STOP("INVALID_COMMIT")

    IF_BRANCH_REFERENCE
        STOP("BRANCH_NOT_DETERMINISTIC")

    IF_LATEST_REFERENCE
        STOP("LATEST_NOT_ALLOWED")


    # INVENTORY

    IF_TREE_INCOMPLETE
        STOP("INCOMPLETE_TREE")

    IF_DUPLICATE_PATH
        STOP("DUPLICATE_PATH")

    IF_INVALID_PATH
        STOP("INVALID_PATH")

    IF_PATH_ESCAPE
        STOP("PATH_ESCAPE")


    # DOWNLOAD

    IF_MISSING_FILE
        STOP("MISSING_FILE")

    IF_UNEXPECTED_FILE
        STOP("UNEXPECTED_FILE")

    IF_SIZE_MISMATCH
        STOP("SIZE_MISMATCH")

    IF_GIT_SHA_MISMATCH
        STOP("GIT_SHA_MISMATCH")


    # DETERMINISM

    IF_INVENTORY_HASH_CHANGED
        STOP("INVENTORY_CHANGED")

    IF_PLAN_HASH_CHANGED
        STOP("PLAN_CHANGED")

    IF_SOURCE_ID_CHANGED
        STOP("SOURCE_CHANGED")


    # DOWNLOAD PACKAGE

    IF_ZIP_HASH_MISMATCH
        STOP("ZIP_HASH_MISMATCH")

    IF_ZIP_INCOMPLETE
        STOP("ZIP_INCOMPLETE")


    # EMBED

    IF_EMBEDDED_SOURCE_MISMATCH
        STOP("EMBED_SOURCE_MISMATCH")

    IF_EMBEDDED_INVENTORY_MISMATCH
        STOP("EMBED_INVENTORY_MISMATCH")

    IF_EMBEDDED_FILE_MISSING
        STOP("EMBED_FILE_MISSING")


    # GENERAL

    IF_PARTIAL_OUTPUT
        STOP("PARTIAL_OUTPUT")

    IF_VERIFICATION_FAILURE
        STOP("VERIFICATION_FAILURE")

    IF_UNEXPECTED_STATE
        STOP("INVALID_STATE")
}

# ============================================================
# OUTPUT CONTRACT
# ============================================================

OUTPUT {

    DOWNLOAD_AGENT {

        PACKAGE =
            CONFIG.distribution.download_agent.artifact

        MANIFEST =
            PACKAGE + ".manifest.json"

        CHECKSUM =
            PACKAGE + ".sha256"
    }


    EMBED_AGENT {

        ROOT =
            CONFIG.distribution.embed_agent.root

        MANIFEST =
            ROOT + "/manifest.json"
    }


    COMMON {

        SOURCE_ID

        SOURCE_COMMIT

        INVENTORY_HASH

        PLAN_HASH

        STATUS
    }
}

# ============================================================
# FINAL STATE MACHINE
# ============================================================

STATE_MACHINE {

    INIT
        -> VALIDATED

    VALIDATED
        -> SOURCE_LOCKED

    SOURCE_LOCKED
        -> TREE_DISCOVERED

    TREE_DISCOVERED
        -> INVENTORY_FROZEN

    INVENTORY_FROZEN
        -> PLAN_FROZEN

    PLAN_FROZEN
        -> ACQUIRING

    ACQUIRING
        -> VERIFIED

    VERIFIED
        -> DISTRIBUTING

    DISTRIBUTING
        -> COMPLETE

    ANY_STATE
        -> FAILED
        ON_SHERIFF_STOP
}

# ============================================================
# NON-NEGOTIABLE RULE
# ============================================================

RULE SAME_AGENT {

    DOWNLOAD_AGENT
    AND
    EMBED_AGENT

    MUST_REFERENCE:

        SAME_SOURCE_COMMIT

        SAME_SOURCE_ID

        SAME_INVENTORY_HASH

        SAME_PLAN_HASH

    OTHERWISE:

        SHERIFF.STOP(
            "DISTRIBUTIONS_ARE_NOT_THE_SAME_AGENT"
        )
}

# ============================================================
# END OUTPUT 2 / 4
# ============================================================


Salida 3/4 — Exportador + empaquetado determinista + importador

Esta parte implementa el DSL anterior. El objetivo es que el mismo commit produzca el mismo inventario y que ese inventario pueda convertirse en ZIP descargable o copiarse dentro de la UI.

# ============================================================
# TEAM AGENT DISTRIBUTION ENGINE
# OUTPUT 3 / 4
# EXPORTER + DETERMINISTIC ZIP + IMPORTER
# ============================================================

from __future__ import annotations

import hashlib
import json
import os
import shutil
import stat
import tempfile
import zipfile

from dataclasses import dataclass
from pathlib import Path


# ============================================================
# CONSTANTS
# ============================================================

SCHEMA = "agent-distribution"
CONTRACT_VERSION = "1.0.0"

EXCLUDED = {
    ".git",
    ".cache",
    "__pycache__",
    "node_modules",
    "tmp",
    "logs",
}


# ============================================================
# SHERIFF
# ============================================================

class SheriffStop(RuntimeError):
    """Fatal deterministic-integrity failure."""


class Sheriff:

    @staticmethod
    def require(condition: bool, message: str):
        if not condition:
            raise SheriffStop(message)

    @staticmethod
    def equal(expected, actual, message: str):
        if expected != actual:
            raise SheriffStop(message)


# ============================================================
# HASHING
# ============================================================

def sha256_bytes(data: bytes) -> str:

    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:

    digest = hashlib.sha256()

    with path.open("rb") as fh:

        while True:

            block = fh.read(1024 * 1024)

            if not block:
                break

            digest.update(block)

    return digest.hexdigest()


# ============================================================
# PATH VALIDATION
# ============================================================

def normalize_relative_path(
    root: Path,
    path: Path,
) -> str:

    relative = path.relative_to(root)

    value = relative.as_posix()

    Sheriff.require(
        not value.startswith("/"),
        "ABSOLUTE_PATH",
    )

    Sheriff.require(
        ".." not in Path(value).parts,
        "PATH_TRAVERSAL",
    )

    return value


def is_excluded(
    relative: str,
) -> bool:

    parts = Path(relative).parts

    return any(
        part in EXCLUDED
        for part in parts
    )


# ============================================================
# GIT BLOB SHA
# ============================================================

def git_blob_sha(
    path: Path,
) -> str:

    data = path.read_bytes()

    header = (
        f"blob {len(data)}\0"
    ).encode("utf-8")

    return sha256_bytes(
        header + data
    )


# ============================================================
# INVENTORY
# ============================================================

@dataclass(frozen=True)
class InventoryEntry:

    path: str
    size: int
    git_sha: str
    mode: int


def build_inventory(
    root: Path,
) -> list[InventoryEntry]:

    root = root.resolve()

    entries = []

    for path in root.rglob("*"):

        if not path.is_file():
            continue

        relative = normalize_relative_path(
            root,
            path,
        )

        if is_excluded(relative):
            continue

        data = path.read_bytes()

        entries.append(
            InventoryEntry(
                path=relative,
                size=len(data),
                git_sha=git_blob_sha(path),
                mode=stat.S_IMODE(
                    path.stat().st_mode
                ),
            )
        )

    entries.sort(
        key=lambda item: item.path
    )

    paths = [
        item.path
        for item in entries
    ]

    Sheriff.require(
        len(paths) == len(set(paths)),
        "DUPLICATE_PATH",
    )

    return entries


# ============================================================
# CANONICAL INVENTORY
# ============================================================

def inventory_document(
    entries: list[InventoryEntry],
) -> list[dict]:

    return [
        {
            "path": item.path,
            "size": item.size,
            "git_sha": item.git_sha,
            "mode": item.mode,
        }
        for item in entries
    ]


def canonical_json(
    value,
) -> bytes:

    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def inventory_hash(
    entries: list[InventoryEntry],
) -> str:

    return sha256_bytes(
        canonical_json(
            inventory_document(entries)
        )
    )


# ============================================================
# MANIFEST
# ============================================================

def create_manifest(
    config: dict,
    entries: list[InventoryEntry],
) -> dict:

    inv_hash = inventory_hash(
        entries
    )

    source = config["source"]

    source_id = sha256_bytes(
        (
            source["provider"]
            + ":"
            + source["owner"]
            + "/"
            + source["repository"]
            + "@"
            + source["commit"]
        ).encode("utf-8")
    )

    manifest = {

        "schema":
            SCHEMA,

        "contract_version":
            CONTRACT_VERSION,

        "agent":
            config["agent"],

        "source":
            source,

        "source_id":
            source_id,

        "inventory_hash":
            inv_hash,

        "inventory":
            inventory_document(entries),

        "verification": {

            "deterministic":
                True,

            "git_object_verification":
                True,

            "sha256":
                True,

            "fail_closed":
                True
        }
    }

    return manifest


# ============================================================
# ZIP METADATA
#
# Fixed timestamp and deterministic ordering prevent ordinary
# filesystem timestamps/order from changing the archive.
# ============================================================

ZIP_DATE = (
    1980,
    1,
    1,
    0,
    0,
    0,
)


def deterministic_zip(
    source_root: Path,
    entries: list[InventoryEntry],
    output: Path,
    manifest: dict,
):

    output.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with zipfile.ZipFile(
        output,
        "w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:

        for item in entries:

            path = (
                source_root
                / item.path
            )

            info = zipfile.ZipInfo(
                filename=item.path,
                date_time=ZIP_DATE,
            )

            info.compress_type = (
                zipfile.ZIP_DEFLATED
            )

            info.external_attr = (
                item.mode & 0o777
            ) << 16

            data = path.read_bytes()

            Sheriff.equal(
                item.size,
                len(data),
                f"SIZE_MISMATCH:{item.path}",
            )

            Sheriff.equal(
                item.git_sha,
                git_blob_sha(path),
                f"GIT_SHA_MISMATCH:{item.path}",
            )

            archive.writestr(
                info,
                data,
            )

        manifest_data = canonical_json(
            manifest
        )

        info = zipfile.ZipInfo(
            filename="manifest.json",
            date_time=ZIP_DATE,
        )

        info.compress_type = (
            zipfile.ZIP_DEFLATED
        )

        archive.writestr(
            info,
            manifest_data,
        )


# ============================================================
# ZIP VERIFICATION
# ============================================================

def verify_zip(
    archive_path: Path,
    manifest: dict,
):

    expected = {
        item["path"]: item
        for item in manifest["inventory"]
    }

    with zipfile.ZipFile(
        archive_path,
        "r",
    ) as archive:

        names = archive.namelist()

        source_names = [
            name
            for name in names
            if name != "manifest.json"
        ]

        Sheriff.equal(
            sorted(source_names),
            sorted(expected),
            "ZIP_INVENTORY_MISMATCH",
        )

        for name in source_names:

            info = archive.getinfo(
                name
            )

            data = archive.read(
                name
            )

            item = expected[name]

            Sheriff.equal(
                item["size"],
                len(data),
                f"ZIP_SIZE_MISMATCH:{name}",
            )

            header = (
                f"blob {len(data)}\0"
            ).encode("utf-8")

            actual_sha = sha256_bytes(
                header + data
            )

            Sheriff.equal(
                item["git_sha"],
                actual_sha,
                f"ZIP_GIT_SHA_MISMATCH:{name}",
            )

        manifest_data = json.loads(
            archive.read(
                "manifest.json"
            ).decode("utf-8")
        )

        Sheriff.equal(
            manifest["inventory_hash"],
            manifest_data[
                "inventory_hash"
            ],
            "MANIFEST_HASH_MISMATCH",
        )


# ============================================================
# DOWNLOAD MODE
# ============================================================

def export_download_agent(
    source_root: Path,
    config: dict,
    output_dir: Path,
) -> dict:

    entries = build_inventory(
        source_root
    )

    manifest = create_manifest(
        config,
        entries,
    )

    artifact = (
        config["distribution"]
        ["download_agent"]
        ["artifact"]
    )

    package = (
        output_dir
        / artifact
    )

    deterministic_zip(
        source_root,
        entries,
        package,
        manifest,
    )

    verify_zip(
        package,
        manifest,
    )

    manifest_path = (
        output_dir
        / f"{artifact}.manifest.json"
    )

    checksum_path = (
        output_dir
        / f"{artifact}.sha256"
    )

    manifest_path.write_bytes(
        canonical_json(manifest)
    )

    checksum_path.write_text(
        sha256_file(package)
        + "\n",
        encoding="utf-8",
    )

    return {
        "mode":
            "DOWNLOAD_AGENT",

        "artifact":
            str(package),

        "manifest":
            str(manifest_path),

        "sha256":
            sha256_file(package),

        "inventory_hash":
            manifest["inventory_hash"],
    }


# ============================================================
# EMBED MODE
# ============================================================

def export_embedded_agent(
    source_root: Path,
    config: dict,
    ui_root: Path,
) -> dict:

    entries = build_inventory(
        source_root
    )

    manifest = create_manifest(
        config,
        entries,
    )

    relative_root = Path(
        config["distribution"]
        ["embed_agent"]
        ["root"]
    )

    destination = (
        ui_root
        / relative_root
    )

    if destination.exists():

        shutil.rmtree(
            destination
        )

    destination.mkdir(
        parents=True,
        exist_ok=True,
    )

    for item in entries:

        source = (
            source_root
            / item.path
        )

        target = (
            destination
            / item.path
        )

        target.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        shutil.copy2(
            source,
            target,
        )

        Sheriff.equal(
            item.size,
            target.stat().st_size,
            f"EMBED_SIZE_MISMATCH:{item.path}",
        )

        Sheriff.equal(
            item.git_sha,
            git_blob_sha(target),
            f"EMBED_SHA_MISMATCH:{item.path}",
        )

    manifest_path = (
        destination
        / "manifest.json"
    )

    manifest_path.write_bytes(
        canonical_json(manifest)
    )

    return {
        "mode":
            "EMBED_AGENT",

        "root":
            str(destination),

        "manifest":
            str(manifest_path),

        "inventory_hash":
            manifest["inventory_hash"],
    }


# ============================================================
# IMPORTER
# ============================================================

def import_agent(
    package: Path,
    destination: Path,
):

    Sheriff.require(
        package.is_file(),
        "PACKAGE_NOT_FOUND",
    )

    with zipfile.ZipFile(
        package,
        "r",
    ) as archive:

        Sheriff.require(
            "manifest.json"
            in archive.namelist(),
            "MANIFEST_NOT_FOUND",
        )

        manifest = json.loads(
            archive.read(
                "manifest.json"
            ).decode("utf-8")
        )

        Sheriff.equal(
            manifest["schema"],
            SCHEMA,
            "INVALID_SCHEMA",
        )

        expected = {
            item["path"]: item
            for item in manifest[
                "inventory"
            ]
        }

        staging = Path(
            tempfile.mkdtemp(
                prefix="agent-import-"
            )
        )

        try:

            for name in archive.namelist():

                if name == "manifest.json":
                    continue

                Sheriff.require(
                    name in expected,
                    f"UNEXPECTED_FILE:{name}",
                )

                target = (
                    staging
                    / name
                )

                target.parent.mkdir(
                    parents=True,
                    exist_ok=True,
                )

                data = archive.read(
                    name
                )

                target.write_bytes(
                    data
                )

            actual_entries = build_inventory(
                staging
            )

            actual_hash = inventory_hash(
                actual_entries
            )

            Sheriff.equal(
                manifest[
                    "inventory_hash"
                ],
                actual_hash,
                "IMPORT_INVENTORY_MISMATCH",
            )

            if destination.exists():
                shutil.rmtree(
                    destination
                )

            destination.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            shutil.move(
                str(staging),
                str(destination),
            )

            return {
                "status":
                    "IMPORTED",

                "inventory_hash":
                    actual_hash,

                "source_id":
                    manifest[
                        "source_id"
                    ],
            }

        except Exception:

            if staging.exists():
                shutil.rmtree(
                    staging,
                    ignore_errors=True,
                )

            raise


# ============================================================
# DISTRIBUTION CONTROLLER
# ============================================================

def distribute(
    source_root: Path,
    config: dict,
    output_dir: Path,
    ui_root: Path | None = None,
):

    modes = config[
        "distribution"
    ]["modes"]

    results = []

    # Both modes use the same source root,
    # same commit and same inventory algorithm.

    if "DOWNLOAD_AGENT" in modes:

        results.append(
            export_download_agent(
                source_root,
                config,
                output_dir,
            )
        )

    if "EMBED_AGENT" in modes:

        Sheriff.require(
            ui_root is not None,
            "UI_ROOT_REQUIRED",
        )

        results.append(
            export_embedded_agent(
                source_root,
                config,
                ui_root,
            )
        )

    Sheriff.require(
        len(results) > 0,
        "NO_DISTRIBUTION_MODE_ENABLED",
    )

    inventory_hashes = {
        result["inventory_hash"]
        for result in results
    }

    Sheriff.require(
        len(inventory_hashes) == 1,
        "DISTRIBUTIONS_USE_DIFFERENT_INVENTORIES",
    )

    return {
        "status":
            "COMPLETE",

        "results":
            results,

        "inventory_hash":
            results[0][
                "inventory_hash"
            ],
    }


# ============================================================
# END OUTPUT 3 / 4
# ============================================================

Qué hace esta salida

El flujo ya queda funcional a nivel de motor:

SOURCE
                   │
                   ▼
              INVENTORY
                   │
             FREEZE/HASH
                   │
          ┌────────┴────────┐
          ▼                 ▼
 DOWNLOAD_AGENT        EMBED_AGENT
          │                 │
          ▼                 ▼
       ZIP + HASH       UI/agent/
          │                 │
          └────────┬────────┘
                   ▼
               VERIFY

La Salida 4 cerrará el sistema con el manifest final, verificador, integración con la UI y pruebas deterministas, incluyendo la regla de que una UI embebida y un ZIP solo pueden considerarse el mismo agente si comparten source_id + inventory_hash.


La Salida 3 queda cerrada.

La siguiente es la Salida 4/4, que completa la integración:

manifest final;

verificación final;

integración DOWNLOAD_AGENT;

integración EMBED_AGENT;

importación desde la UI;

pruebas deterministas;

estados de éxito/fallo;

cierre del Sheriff;

estructura final del paquete.



Salida 4/4 — Integración final UI + manifest + verificación + pruebas

Esta es la última salida. Conecta el motor de la Salida 3 con la UI y deja definidos los controles finales para que descargar el agente y llevar el agente embebido dentro de la UI sean dos productos derivados de la misma fuente.

============================================================
TEAM AGENT DISTRIBUTION
OUTPUT 4 / 4
UI INTEGRATION + FINAL MANIFEST + TESTS
============================================================


============================================================
1. ESTRUCTURA FINAL DEL PROYECTO
============================================================

PROJECT/

├── agent-distribution/
│
│   ├── config/
│   │   └── agent-distribution.json
│   │
│   ├── schemas/
│   │   └── agent-distribution.v1.schema.json
│   │
│   ├── dsl/
│   │   └── distribution.dsl
│   │
│   ├── engine/
│   │   └── distribution_engine.py
│   │
│   └── tests/
│       └── test_distribution.py
│
├── ui/
│
│   ├── agent/
│   │   └── [AGENTE EMBEBIDO]
│   │
│   └── distribution/
│       └── agent-manifest.json
│
└── artifacts/
    │
    ├── TEAM-Agent-v1.0.0.zip
    ├── TEAM-Agent-v1.0.0.zip.manifest.json
    └── TEAM-Agent-v1.0.0.zip.sha256


============================================================
2. MANIFEST FINAL
============================================================

FINAL_MANIFEST {

    schema:
        "agent-distribution"

    contract_version:
        "1.0.0"

    agent {

        id

        name

        version
    }

    source {

        provider

        owner

        repository

        commit

        source_id
    }

    verification {

        deterministic

        inventory_hash

        plan_hash

        artifact_sha256

        file_count

        total_size

    }

    distributions {

        DOWNLOAD_AGENT {

            enabled

            artifact

            sha256

        }

        EMBED_AGENT {

            enabled

            root

            inventory_hash

        }
    }

    status:
        "VERIFIED"
}


============================================================
3. FINAL MANIFEST GENERATOR
============================================================

FUNCTION BUILD_FINAL_MANIFEST(
    config,
    source_id,
    inventory_hash,
    plan_hash,
    download_result,
    embed_result
):

    manifest = {

        "schema":
            "agent-distribution",

        "contract_version":
            "1.0.0",

        "agent":
            config["agent"],

        "source": {

            "provider":
                config["source"]["provider"],

            "owner":
                config["source"]["owner"],

            "repository":
                config["source"]["repository"],

            "commit":
                config["source"]["commit"],

            "source_id":
                source_id
        },

        "verification": {

            "deterministic":
                true,

            "inventory_hash":
                inventory_hash,

            "plan_hash":
                plan_hash
        },

        "distributions": {},

        "status":
            "VERIFIED"
    }


    IF download_result EXISTS:

        manifest["distributions"][
            "DOWNLOAD_AGENT"
        ] = {

            "enabled":
                true,

            "artifact":
                download_result["artifact"],

            "sha256":
                download_result["sha256"]
        }


    IF embed_result EXISTS:

        manifest["distributions"][
            "EMBED_AGENT"
        ] = {

            "enabled":
                true,

            "root":
                embed_result["root"],

            "inventory_hash":
                embed_result["inventory_hash"]
        }


    RETURN manifest


============================================================
4. SHERIFF FINAL
============================================================

SHERIFF FINAL {

    REQUIRE schema == "agent-distribution"

    REQUIRE contract_version == "1.0.0"

    REQUIRE source.commit IS_VALID_SHA256_COMMIT

    REQUIRE source_id EXISTS

    REQUIRE inventory_hash EXISTS

    REQUIRE plan_hash EXISTS

    REQUIRE deterministic == true


    IF DOWNLOAD_AGENT ENABLED:

        REQUIRE artifact EXISTS

        REQUIRE artifact_sha256 EXISTS

        REQUIRE artifact_verified == true


    IF EMBED_AGENT ENABLED:

        REQUIRE embedded_root EXISTS

        REQUIRE embedded_agent_verified == true

        REQUIRE embedded_inventory_hash
            == inventory_hash


    IF BOTH_MODES_ENABLED:

        REQUIRE download_inventory_hash
            == embedded_inventory_hash

        REQUIRE download_source_id
            == embedded_source_id


    IF ANY_CHECK_FAILS:

        STOP


    ELSE:

        STATUS = VERIFIED
}


============================================================
5. UI API
============================================================

UI API {

    POST /agent/export

    POST /agent/import

    GET /agent/status

    GET /agent/manifest

}


============================================================
6. UI EXPORT
============================================================

POST /agent/export

REQUEST:

{
    "mode": "DOWNLOAD_AGENT"
}


PROCESS:

    LOAD_CONFIG

    VALIDATE_SCHEMA

    LOCK_COMMIT

    BUILD_INVENTORY

    FREEZE_INVENTORY

    BUILD_PLAN

    FREEZE_PLAN

    EXPORT

    VERIFY

    RETURN_ARTIFACT


RESPONSE:

{
    "status": "VERIFIED",
    "mode": "DOWNLOAD_AGENT",
    "artifact": "TEAM-Agent-v1.0.0.zip",
    "sha256": "<SHA256>",
    "source_commit": "<COMMIT>",
    "inventory_hash": "<HASH>"
}


============================================================
7. UI EMBED
============================================================

POST /agent/export

REQUEST:

{
    "mode": "EMBED_AGENT"
}


PROCESS:

    LOAD_CONFIG

    VALIDATE_SCHEMA

    LOCK_COMMIT

    BUILD_INVENTORY

    FREEZE_INVENTORY

    BUILD_PLAN

    FREEZE_PLAN

    COPY_TO_UI_AGENT_ROOT

    VERIFY_EMBEDDED_TREE

    WRITE_MANIFEST

    RETURN_UI_STATUS


RESPONSE:

{
    "status": "VERIFIED",
    "mode": "EMBED_AGENT",
    "root": "ui/agent/",
    "source_commit": "<COMMIT>",
    "inventory_hash": "<HASH>"
}


============================================================
8. BOTH MODES
============================================================

POST /agent/export

REQUEST:

{
    "mode": "BOTH"
}


PROCESS:

    RUN_SHARED_SOURCE_DISCOVERY

    RUN_SHARED_INVENTORY

    FREEZE

    ┌──────────────────────┐
    │ SAME SOURCE          │
    │ SAME COMMIT          │
    │ SAME INVENTORY       │
    │ SAME PLAN            │
    └──────────┬───────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
      ZIP            UI
        │             │
        ▼             ▼
     VERIFY         VERIFY
        │             │
        └──────┬──────┘
               ▼
        CROSS-VERIFY
               │
               ▼
           COMPLETE


REQUIRE:

    ZIP.inventory_hash
        ==
    UI.inventory_hash

    ZIP.source_id
        ==
    UI.source_id


============================================================
9. UI IMPORT
============================================================

POST /agent/import

INPUT:

    TEAM-Agent-v1.0.0.zip


PROCESS:

    CHECK_FILE_EXISTS

    CHECK_EXTENSION

    OPEN_ARCHIVE

    READ_MANIFEST

    VALIDATE_SCHEMA

    VERIFY_SOURCE_ID

    VERIFY_INVENTORY_HASH

    CREATE_STAGING

    EXTRACT_FILES

    REBUILD_INVENTORY

    COMPARE_INVENTORY

    VERIFY_SHA256

    IF_VALID:

        ACTIVATE_AGENT

    IF_INVALID:

        DELETE_STAGING

        DO_NOT_ACTIVATE


SUCCESS:

{
    "status": "IMPORTED",
    "verified": true,
    "inventory_hash": "<HASH>",
    "source_id": "<HASH>"
}


FAILURE:

{
    "status": "REJECTED",
    "verified": false,
    "reason": "<ERROR_CODE>"
}


============================================================
10. ATOMIC IMPORT
============================================================

IMPORT_RULE {

    NEVER_EXTRACT_DIRECTLY_TO_ACTIVE_AGENT

}


CORRECT:

    package
       │
       ▼
    staging/
       │
       ▼
    verify
       │
       ▼
    rename/swap
       │
       ▼
    active-agent/


INCORRECT:

    package
       │
       ▼
    active-agent/


IF VERIFICATION_FAILS:

    STAGING IS DELETED

    ACTIVE_AGENT REMAINS_UNCHANGED


============================================================
11. DETERMINISTIC TEST SUITE
============================================================

TEST 01:

    SAME_COMMIT
    SAME_SOURCE

    EXPECT:

        SAME_SOURCE_ID


TEST 02:

    SAME_SOURCE

    EXPECT:

        SAME_INVENTORY_HASH


TEST 03:

    SAME_INVENTORY

    EXPECT:

        SAME_PLAN_HASH


TEST 04:

    SAME_SOURCE
    SAME_INVENTORY
    SAME_PLAN

    EXPECT:

        SAME_FILE_SET


TEST 05:

    EXPORT DOWNLOAD_AGENT

    EXPECT:

        ZIP_EXISTS


TEST 06:

    VERIFY ZIP

    EXPECT:

        PASS


TEST 07:

    EXPORT EMBED_AGENT

    EXPECT:

        UI_AGENT_EXISTS


TEST 08:

    VERIFY EMBEDDED_AGENT

    EXPECT:

        PASS


TEST 09:

    DOWNLOAD_AGENT
    + EMBED_AGENT

    EXPECT:

        SAME_SOURCE_ID


TEST 10:

    DOWNLOAD_AGENT
    + EMBED_AGENT

    EXPECT:

        SAME_INVENTORY_HASH


TEST 11:

    DELETE ONE FILE FROM ZIP

    EXPECT:

        REJECT


TEST 12:

    MODIFY ONE BYTE

    EXPECT:

        SHA256_MISMATCH


TEST 13:

    ADD UNEXPECTED FILE

    EXPECT:

        REJECT


TEST 14:

    INVALID COMMIT

    EXPECT:

        REJECT


TEST 15:

    BRANCH WITHOUT COMMIT

    EXPECT:

        REJECT


TEST 16:

    "latest"

    EXPECT:

        REJECT


TEST 17:

    PATH "../outside"

    EXPECT:

        REJECT


TEST 18:

    ABSOLUTE PATH

    EXPECT:

        REJECT


TEST 19:

    PARTIAL DOWNLOAD

    EXPECT:

        REJECT


TEST 20:

    CORRUPTED MANIFEST

    EXPECT:

        REJECT


TEST 21:

    IMPORT VALID PACKAGE

    EXPECT:

        ACTIVE_AGENT_UPDATED


TEST 22:

    IMPORT INVALID PACKAGE

    EXPECT:

        ACTIVE_AGENT_UNCHANGED


============================================================
12. FINAL STATE MACHINE
============================================================

STATES:

    INIT

    CONFIG_VALIDATED

    SOURCE_LOCKED

    TREE_VERIFIED

    INVENTORY_FROZEN

    PLAN_FROZEN

    STAGING_READY

    FILES_ACQUIRED

    SOURCE_VERIFIED

    PACKAGE_VERIFIED

    EMBED_VERIFIED

    COMPLETE

    FAILED


TRANSITIONS:

    INIT
        ->
    CONFIG_VALIDATED


    CONFIG_VALIDATED
        ->
    SOURCE_LOCKED


    SOURCE_LOCKED
        ->
    TREE_VERIFIED


    TREE_VERIFIED
        ->
    INVENTORY_FROZEN


    INVENTORY_FROZEN
        ->
    PLAN_FROZEN


    PLAN_FROZEN
        ->
    STAGING_READY


    STAGING_READY
        ->
    FILES_ACQUIRED


    FILES_ACQUIRED
        ->
    SOURCE_VERIFIED


    SOURCE_VERIFIED
        ->
    PACKAGE_VERIFIED
        OR
    EMBED_VERIFIED


    PACKAGE_VERIFIED
        ->
    COMPLETE


    EMBED_VERIFIED
        ->
    COMPLETE


    ANY_STATE
        ->
    FAILED
    ON_SHERIFF_STOP


============================================================
13. DISTRIBUTION CONTRACT
============================================================

MODE DOWNLOAD_AGENT:

    PURPOSE:

        Produce an independent
        portable agent package.


    RESULT:

        TEAM-Agent-vX.Y.Z.zip


MODE EMBED_AGENT:

    PURPOSE:

        Produce a UI distribution
        containing the verified agent.


    RESULT:

        UI + agent/


MODE BOTH:

    PURPOSE:

        Produce both distributions
        from exactly the same frozen source.


    REQUIRE:

        SAME_COMMIT

        SAME_SOURCE_ID

        SAME_INVENTORY_HASH

        SAME_PLAN_HASH


============================================================
14. FINAL PACKAGE
============================================================

DOWNLOAD DISTRIBUTION:

TEAM-Agent-v1.0.0.zip
TEAM-Agent-v1.0.0.zip.manifest.json
TEAM-Agent-v1.0.0.zip.sha256


EMBED DISTRIBUTION:

TEAM-UI/
├── app/
├── ui/
├── agent/
│   ├── manifest.json
│   ├── core/
│   ├── agents/
│   ├── workflows/
│   ├── memory/
│   └── tools/
└── distribution/
    └── agent-manifest.json


============================================================
15. FINAL DETERMINISTIC RULE
============================================================

RULE {

    SOURCE_COMMIT
        IS THE SOURCE OF TRUTH

    INVENTORY
        IS THE CONTENT LOCK

    PLAN
        IS THE EXECUTION LOCK

    MANIFEST
        IS THE IDENTITY RECORD

    SHA256
        IS THE ARTIFACT INTEGRITY CHECK

    SHERIFF
        IS THE FAILURE GATE

    UI EMBED
        MUST NOT MODIFY AGENT CONTENT

    DOWNLOAD
        MUST NOT MODIFY AGENT CONTENT

    IMPORT
        MUST VERIFY BEFORE ACTIVATION
}


============================================================
16. FINAL RESULT
============================================================

ONE AGENT SOURCE

        │
        ▼

ONE PINNED COMMIT

        │
        ▼

ONE FROZEN INVENTORY

        │
        ▼

ONE FROZEN PLAN

        │
        ├─────────────────┐
        ▼                 ▼
DOWNLOAD_AGENT       EMBED_AGENT
        │                 │
        ▼                 ▼
   AGENT.ZIP          UI + AGENT
        │                 │
        └────────┬────────┘
                 ▼
             VERIFY
                 │
                 ▼
              READY


============================================================
END OF OUTPUT 4 / 4
============================================================

Sistema completo terminado

Las cuatro salidas forman una sola cadena:

JSON
 ↓
DSL
 ↓
DAG
 ↓
SHERIFF
 ↓
EXPORTER
 ↓
ZIP / EMBED
 ↓
MANIFEST
 ↓
SHA-256
 ↓
IMPORTER
 ↓
UI

La propiedad clave es que DOWNLOAD_AGENT y EMBED_AGENT no son dos procesos independientes: parten del mismo commit, inventario y plan congelados. Por tanto, la UI embebida y el ZIP pueden comprobarse criptográficamente contra la misma identidad del agente.




