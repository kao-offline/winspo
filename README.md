# WInspo

A serverless, no-login app for turning your client's design-reference picks into a short shareable code. Your client clicks the references they like, and WInspo encodes their selection into a compact base62 string. Your designer (or you) can decode that code against the exact same dataset to see the selection and an aggregated design profile — no accounts, no database, no state to manage.

## How it works

- A **dataset** is a JSON manifest describing a set of design references (title, URL, tags, optional media) plus optional theming config.
- Each item has a permanent **`slot`** — a stable number used for encoding. Slots are never reused, so removing/reordering items in a future dataset edition doesn't break old codes.
- A selection is stored as a **bitmask** (bit *n* = slot *n* selected), converted to a **base62** string.
- The code alone is not self-describing — it only means something against a specific dataset + version, so always share the dataset link together with the code.

## Try it

- **Browse + select** a dataset, e.g. `https://winspo.example/kao`
- **Generated code screen**: `https://winspo.example/kao?code=7`
- **Decode + profile**: `https://winspo.example/kao/lookup?code=7`

## Built-in datasets

| Path | Contents |
| --- | --- |
| `/kao` (alias `/root`) | 44 curated website references |
| `/illustro` | coming soon |
| `/tech` | coming soon |

## BYO dataset

Any public GitHub repo can serve as a dataset, no setup required:

```
https://winspo.example/byo/<user>/<repo>@<ref>
```

WInspo loads `<user>/<repo>@<ref>` from `raw.githubusercontent.com` using the manifest at the repo root named `winspo.json` (any ref: branch, tag, or commit SHA). Datasets are validated with Zod, cached in memory for 10 minutes, and rate-limited per IP. Assets are fetched from the repo with a 30 MB cap (HEAD-checked first); oversized/missing media is skipped with a warning instead of crashing the page.

To use your own theming, add `winspo.config.json` to the repo root alongside `winspo.json`.

## Dataset format

Repo layout:

```
my-dataset/
├── winspo.json           # required manifest
├── winspo.config.json    # optional theming
└── assets/               # optional media, referenced as relative paths
```

### `winspo.json`

```json
{
  "name": "my-dataset",
  "version": "1.0.0",
  "description": "My favorite sites.",
  "items": [
    {
      "id": 1,
      "slot": 0,
      "title": "Example",
      "url": "https://example.com/",
      "media": {
        "thumbnail": "assets/example-thumb.webp",
        "fullpage": "assets/example-fullpage.webp",
        "video": "assets/example-clip.mp4"
      },
      "tags": {
        "palette": ["bright", "warm"],
        "layout": "asymmetric",
        "motion": "medium",
        "typography": "display-serif",
        "category": "portfolio"
      }
    }
  ]
}
```

- `id` — unique per dataset (can be reused across datasets).
- `slot` — stable, permanent bit position. **Never reuse a slot after deleting an item**; old codes would silently decode to the wrong reference.
- `media` — all fields optional; paths are relative to the repo root.
- `tags` — required. `palette` is a string array; the other four are single strings.

### `winspo.config.json`

```json
{
  "primary": "#E8552B",
  "accent": "#7A1E1E",
  "background": "#FFFFFF",
  "text": "#1A1A1A",
  "font": "Inter",
  "logo": "/custom-logo.svg",
  "logoLink": "https://example.com",
  "defaultDataset": "kao"
}
```

Colors accept `#rgb`, `#rrggbb`, or `rgb(r g b)` values; they are mapped onto CSS variables at runtime. `defaultDataset` is applied by the landing page's dataset picker.

## Public API

All endpoints accept `GET` + `OPTIONS` with CORS `Access-Control-Allow-Origin: *`.

### `GET /api/datasets/{source}`

Full dataset manifest. `{source}` can be a built-in (`kao`) or a BYO path (`byo/{user}/{repo}@{ref}`).

### `GET /api/encode?dataset={source}&slots={comma-separated}`

Encode slot numbers into a base62 code.

```json
{ "code": "7", "slots": [0, 1, 2] }
```

### `GET /api/decode?dataset={source}&code={code}`

Decode a code against a dataset. Returns matched items, their design profile summary, and an `unknown` flag when the code references slots that no longer exist in this dataset edition (e.g. items were removed).

```json
{
  "code": "7",
  "itemCount": 44,
  "slots": [0, 1, 2],
  "unknown": false,
  "selectedItemIds": [1, 2, 3],
  "items": [ ... ],
  "profile": { "summary": "...", "byCategory": { ... } }
}
```

## Embed mode

Append `?embed` to any gallery/lookup URL to hide chrome and communicate with the parent window. The page sends `window.parent.postMessage` (targetOrigin `*`) with messages shaped as:

| Type | Payload |
| --- | --- |
| `winspo:ready` | `{ type, datasetSource, itemCount }` |
| `winspo:selection` | `{ type, datasetSource, selectedItemIds }` — sent on every selection change |
| `winspo:code` | `{ type, datasetSource, code, selectedItemIds }` — sent when the user finishes |

Example:

```html
<iframe src="https://winspo.example/kao?embed"></iframe>
```

```js
window.addEventListener("message", (event) => {
  const msg = event.data;
  if (msg && msg.type === "winspo:code") {
    console.log("client picked:", msg.code, msg.selectedItemIds);
  }
});
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest (codec, profile, validation, theming)
npm run typecheck
npm run lint
npm run build
```

The built-in `kao` dataset was generated from a local gallery folder with:

```bash
npm run datasets:convert
```

This is an experimental reimplementation of a client-mockup tool with a much simpler architecture: no accounts, no database, no external storage.
