import fs from 'node:fs/promises'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { createMarkdownExit } from 'markdown-exit'
import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'
import Shiki from '../src'
import { fromHighlighter } from '../src/core'

it('run for base', { timeout: 10_000 }, async () => {
  const md = createMarkdownExit()
  using shiki = await createHighlighter({
    langs: ['js'],
    themes: ['vitesse-light', 'vitesse-dark'],
  })
  md.use(fromHighlighter(shiki, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/a.md', import.meta.url), 'utf-8'))

  await expect(result).toMatchFileSnapshot('./fixtures/a.out.html')
})

it('run for fallback language', { timeout: 10_000 }, async () => {
  const md = createMarkdownExit()
  using shiki = await createHighlighter({
    langs: ['js'],
    themes: ['vitesse-light', 'vitesse-dark'],
  })
  md.use(fromHighlighter(shiki, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    fallbackLanguage: 'js',
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = md.render(await fs.readFile(new URL('./fixtures/b.md', import.meta.url), 'utf-8'))

  await expect(result).toMatchFileSnapshot('./fixtures/b.out.html')
})

it('run for default language', { timeout: 10_000 }, async () => {
  const md = createMarkdownExit()
  md.use(Shiki({
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultLanguage: 'js',
    transformers: [
      transformerMetaHighlight(),
    ],
  }))

  const result = await md.renderAsync(await fs.readFile(new URL('./fixtures/c.md', import.meta.url), 'utf-8'))

  await expect(result).toMatchFileSnapshot('./fixtures/c.out.html')
})
