import type { MarkdownExit } from 'markdown-exit'
import type {
  CodeToHastOptions,
  HighlighterGeneric,
  ShikiTransformer,
} from 'shiki'
import type { MarkdownExitShikiSetupOptions } from './common'

export type { MarkdownExitShikiExtraOptions, MarkdownExitShikiSetupOptions } from './common'

export function setupMarkdownExit(
  md: MarkdownExit,
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownExitShikiSetupOptions,
): void {
  const {
    parseMetaString,
    trimEndingNewline = true,
    defaultLanguage = 'text',
    fallbackLanguage,
  } = options
  const langs = highlighter.getLoadedLanguages()
  md.options.highlight = (code, lang = 'text', attrs, _env) => {
    if (lang === '') {
      lang = defaultLanguage as string
    }
    if (fallbackLanguage && !langs.includes(lang)) {
      lang = fallbackLanguage as string
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

    return highlighter.codeToHtml(
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

export function fromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownExitShikiSetupOptions,
) {
  return function (md: MarkdownExit) {
    setupMarkdownExit(md, highlighter, options)
  }
}
