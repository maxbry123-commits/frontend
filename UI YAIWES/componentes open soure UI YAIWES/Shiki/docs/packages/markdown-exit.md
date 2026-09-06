# @shikijs/markdown-exit

<Badges name="@shikijs/markdown-exit" />

[markdown-exit](https://github.com/serkodev/markdown-exit) plugin for Shiki.

`markdown-exit` is a modern TypeScript rewrite of `markdown-it` with native async rendering support — no extra library needed for async highlighting.

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/markdown-exit
```

```sh [yarn]
yarn add -D @shikijs/markdown-exit
```

```sh [pnpm]
pnpm add -D @shikijs/markdown-exit
```

```sh [bun]
bun add -D @shikijs/markdown-exit
```

```sh [deno]
deno add npm:@shikijs/markdown-exit
```

:::

## Usage

The default export uses Shiki's [shorthands](/guide/shorthands) for on-demand loading of themes and languages. Since highlighting is async, use `md.renderAsync()` to render:

````ts
import Shiki from '@shikijs/markdown-exit'
import { createMarkdownExit } from 'markdown-exit'

const md = createMarkdownExit()

md.use(Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))

// Use `md.renderAsync` instead of `md.render`
const html = await md.renderAsync('# Title\n```ts\nconsole.log("Hello, World!")\n```')
````

## Transformers

You can pass [transformers](/guide/transformers) to the plugin options to customize the highlighted code.

```ts
import Shiki from '@shikijs/markdown-exit'
import { transformerNotationDiff } from '@shikijs/transformers'
import { createMarkdownExit } from 'markdown-exit'

const md = createMarkdownExit()

md.use(Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  transformers: [
    transformerNotationDiff(),
  ],
}))

const html = await md.renderAsync(md_string)
```

## Custom `codeToHtml`

If you have a custom `codeToHtml` function (e.g., from a fine-grained shorthand bundle), use `fromAsyncCodeToHtml`:

````ts
import { fromAsyncCodeToHtml } from '@shikijs/markdown-exit'
import { createMarkdownExit } from 'markdown-exit'
import { codeToHtml } from 'shiki' // Or your custom shorthand bundle

const md = createMarkdownExit()

md.use(
  fromAsyncCodeToHtml(
    codeToHtml,
    {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    }
  )
)

// Use `md.renderAsync` instead of `md.render`
const html = await md.renderAsync('# Title\n```ts\nconsole.log("Hello, World!")\n```')
````

## Fine-grained Bundle

By default, the full bundle of `shiki` will be imported. If you are using a [fine-grained bundle](/guide/bundles#fine-grained-bundle), you can import from `@shikijs/markdown-exit/core` and pass your own highlighter:

```ts
import { fromHighlighter } from '@shikijs/markdown-exit/core'
import { createMarkdownExit } from 'markdown-exit'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
  ],
  engine: createOnigurumaEngine(() => import('shiki/wasm'))
})

const md = createMarkdownExit()

md.use(fromHighlighter(highlighter, { /* options */ }))
```
