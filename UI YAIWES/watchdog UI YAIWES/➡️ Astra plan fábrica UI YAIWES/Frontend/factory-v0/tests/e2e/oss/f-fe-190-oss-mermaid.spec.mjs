import { test, expect } from '@playwright/test';

test.describe('F-FE-190 Mermaid thin adapter', () => {
  test('renders through injected Mermaid runtime with strict security and no state engine', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async () => {
      const mod = await import(`/src/oss/mermaid-adapter-v1.js?t=${Date.now()}`);
      const calls = { init: [], render: [], bind: 0 };
      const runtime = {
        initialize(options) { calls.init.push(options); },
        async render(id, source) {
          calls.render.push({ id, source });
          return {
            svg: `<svg xmlns="http://www.w3.org/2000/svg" data-id="${id}"><text>${source.length}</text></svg>`,
            bindFunctions(element) { if (element?.id === 'mermaid-host') calls.bind += 1; },
          };
        },
      };
      const host = document.createElement('div');
      host.id = 'mermaid-host';
      document.body.append(host);
      const adapter = mod.createMermaidAdapter(runtime, { maxSourceLength: 2_000 });
      const first = await adapter.render(host, 'flowchart TD\nA-->B', { id: 'Factory Preview 1' });
      const second = await adapter.render(host, 'sequenceDiagram\nA->>B: test', { id: 'Factory Preview 2' });
      return {
        capability: mod.MERMAID_CAPABILITY,
        initCount: calls.init.length,
        init: calls.init[0],
        renderCount: calls.render.length,
        ids: calls.render.map((x) => x.id),
        sources: calls.render.map((x) => x.source),
        bindCount: calls.bind,
        hostHtml: host.innerHTML,
        dataset: { ...host.dataset },
        first,
        second,
        status: adapter.status(),
      };
    });

    expect(result.capability.component).toBe('Mermaid');
    expect(result.capability.sourceVersion).toBe('10.2.4');
    expect(result.capability.license).toBe('MIT');
    expect(result.capability.stateOwner).toBe('YAIWES');
    expect(result.capability.wired).toBe(false);
    expect(result.initCount).toBe(1);
    expect(result.init.startOnLoad).toBe(false);
    expect(result.init.securityLevel).toBe('strict');
    expect(result.renderCount).toBe(2);
    expect(result.ids).toEqual(['factory-preview-1', 'factory-preview-2']);
    expect(result.sources[0]).toContain('A-->B');
    expect(result.bindCount).toBe(2);
    expect(result.hostHtml).toContain('<svg');
    expect(result.dataset.yaiwesOss).toBe('mermaid');
    expect(result.dataset.yaiwesMermaidId).toBe('factory-preview-2');
    expect(result.first.renderCount).toBe(1);
    expect(result.second.renderCount).toBe(2);
    expect(result.status).toEqual({ initialized: true, renders: 2, wired: false });
  });

  test('fails closed for missing source, oversized source, invalid runtime and unsafe SVG', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async () => {
      const mod = await import(`/src/oss/mermaid-adapter-v1.js?t=${Date.now()}`);
      const errors = {};
      try { mod.createMermaidAdapter({}); } catch (error) { errors.runtime = error.message; }
      const safeRuntime = {
        initialize() {},
        async render() { return { svg: '<svg xmlns="http://www.w3.org/2000/svg"></svg>' }; },
      };
      const safe = mod.createMermaidAdapter(safeRuntime, { maxSourceLength: 8 });
      const host = document.createElement('div');
      host.innerHTML = '<span>preserve</span>';
      try { await safe.render(host, '   '); } catch (error) { errors.empty = error.message; }
      try { await safe.render(host, 'flowchart TD\nA-->B'); } catch (error) { errors.large = error.message; }
      const unsafe = mod.createMermaidAdapter({
        initialize() {},
        async render() { return { svg: '<svg onload="alert(1)"></svg>' }; },
      });
      try { await unsafe.render(host, 'graph TD\nA-->B'); } catch (error) { errors.unsafe = error.message; }
      return { errors, html: host.innerHTML };
    });

    expect(result.errors.runtime).toBe('MERMAID_RUNTIME_REQUIRED');
    expect(result.errors.empty).toBe('MERMAID_SOURCE_REQUIRED');
    expect(result.errors.large).toBe('MERMAID_SOURCE_TOO_LARGE');
    expect(result.errors.unsafe).toBe('MERMAID_UNSAFE_OR_INVALID_SVG');
    expect(result.html).toBe('<span>preserve</span>');
  });
});
