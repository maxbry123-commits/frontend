import type { MarkdownExit } from 'markdown-exit'
import type { CodeToHastOptions, ShikiTransformer } from 'shiki'
import type { MarkdownExitShikiSetupOptions } from './common'
import { codeToHtml as defaultCodeToHtml } from 'shiki'

export type { MarkdownExitShikiExtraOptions, MarkdownExitShikiSetupOptions } from './common'
export * from './core'

export function setupMarkdownExitAsync(
  md: MarkdownExit,
  codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>,
  options: MarkdownExitShikiSetupOptions,
): void {
  const {
    parseMetaString,
    trimEndingNewline = true,
    defaultLanguage = 'text',
  } = options

  md.options.highlight = async (code, lang = 'text', attrs, _env) => {
    if (lang === '') {
      lang = defaultLanguage as string
    }
    const meta = parseMetaString?.(attrs, code, lang) || {}
    const codeOptions: CodeToHastOptions = {
      ...options,
      lang,
      meta: {
        ...options.meta,
        ...meta,
        __raw: attrs,
      },
    }

    const builtInTransformer: ShikiTransformer[] = []

    builtInTransformer.push({
      name: '@shikijs/markdown-exit:block-class',
      code(node) {
        node.properties.class = `language-${lang}`
      },
    })

    if (trimEndingNewline) {
      if (code.endsWith('\n'))
        code = code.slice(0, -1)
    }

    return await codeToHtml(
      code,
      {
        ...codeOptions,
        transformers: [
          ...builtInTransformer,
          ...codeOptions.transformers || [],
        ],
      },
    )
  }
}

/**
 * Create a markdown-exit plugin from a codeToHtml function.
 *
 * Unlike markdown-it which requires `markdown-it-async` for async highlighting,
 * markdown-exit natively supports async highlight functions and `renderAsync()`.
 */
export function fromAsyncCodeToHtml(
  codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>,
  options: MarkdownExitShikiSetupOptions,
) {
  return function (md: MarkdownExit) {
    setupMarkdownExitAsync(md, codeToHtml, options)
  }
}

export default function markdownExitShiki(options: MarkdownExitShikiSetupOptions) {
  return function (md: MarkdownExit) {
    setupMarkdownExitAsync(md, defaultCodeToHtml, options)
  }
}
