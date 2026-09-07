# Manifest schema (borrador)

```json
{
  "id": "fn.example",
  "kind": "button",
  "targetSlot": "window.home.toolbar",
  "label": "Ejemplo",
  "icon": "plus",
  "size": "large",
  "action": "fn.example.run",
  "acl": "config-key"
}
```

Sin slot válido o sin action registrada: no pintar.
