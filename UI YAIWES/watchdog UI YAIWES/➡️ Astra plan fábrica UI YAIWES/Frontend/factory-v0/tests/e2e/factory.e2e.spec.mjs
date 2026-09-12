import { test, expect } from '@playwright/test';

test.describe('YAIWES Factory V1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText('YAIWES UI Factory')).toBeVisible();
  });
  const openConfig = async (page, tab) => {
    await page.locator('#toggle-config').click();
    await page.locator(`[data-config-tab="${tab}"]`).click();
  };

  test('base: cinco pasos, crear/editar, undo/redo y versionado', async ({ page }) => {
    await expect(page.locator('#step-title')).toContainText('Crear');
    await page.locator('#new-component').click();
    const node=page.locator('.node').first(); await node.click();
    await page.locator('#prop-label').fill('Ventana principal'); await page.locator('#prop-label').press('Tab');
    await expect(node).toContainText('Ventana principal');
    await page.locator('#undo').click(); await page.locator('#redo').click();
    await page.locator('#save-version').click(); await expect(page.locator('#status')).toContainText('V1');
    for(let i=0;i<8;i++) await page.locator('#next-step').click();
    await expect(page.locator('#step-title')).toContainText('Validar');
  });

  test('1 router IA: añade varios modelos y modo equipo', async ({ page }) => {
    await openConfig(page,'router');
    for (const [name,role] of [['GPT','planner'],['Claude','designer']]) {
      await page.locator('#model-name').fill(name); await page.locator('#model-endpoint').fill('https://router.example/api');
      await page.locator('#model-secret-ref').fill(`secret://${name.toLowerCase()}`); await page.locator('#model-role').selectOption(role); await page.locator('#add-model').click();
    }
    await page.locator('#team-mode').selectOption('quorum');
    await expect(page.locator('#model-list')).toContainText('GPT'); await expect(page.locator('#model-list')).toContainText('Claude');
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('yaiwes-factory-config-v1')).teamMode)).toBe('quorum');
  });

  test('2 remoto: guarda MCP/HTTP y prueba configuración inválida/segura', async ({ page }) => {
    await openConfig(page,'remote');
    await page.locator('#remote-protocol').selectOption('MCP_HTTP'); await page.locator('#remote-url').fill('not-a-url');
    await page.locator('#remote-secret-ref').fill('secret://remote'); await page.locator('#save-remote').click(); await page.locator('#probe-remote').click();
    await expect(page.locator('#remote-status')).toContainText('INVALID_CONFIG');
  });

  test('3 skills: agrega principal y referencia', async ({ page }) => {
    await openConfig(page,'skills');
    await page.locator('#skill-name').fill('Design System'); await page.locator('#skill-source').fill('https://github.com/acme/design'); await page.locator('#add-skill').click();
    await page.locator('#skill-name').fill('Reference UX'); await page.locator('#skill-source').fill('https://example.com/ux'); await page.locator('#skill-purpose').selectOption('referencia'); await page.locator('#add-skill').click();
    await expect(page.locator('#skill-list .mini-card')).toHaveCount(2);
  });

  test('4 entradas: archivo, HTML, URL y GitHub', async ({ page }) => {
    await openConfig(page,'inputs');
    await page.locator('#file-input').setInputFiles({name:'mock.png',mimeType:'image/png',buffer:Buffer.from('png')});
    await page.locator('#html-input').fill('<main>demo</main>'); await page.locator('#load-html-source').click();
    await page.locator('#source-url').fill('https://example.com/page'); await page.locator('#add-source-url').click();
    await page.locator('#github-source').fill('https://github.com/openai/openai'); await page.locator('#add-github-source').click();
    await expect(page.locator('#source-list .mini-card')).toHaveCount(4);
  });

  test('5 destinos: download/github/hf/vercel/mcp/share/custom y plan de salida', async ({ page }) => {
    await openConfig(page,'destinations');
    for (const type of ['DOWNLOAD','GITHUB','HUGGINGFACE','VERCEL','MCP','SHARE','CUSTOM_HTTP']) {
      await page.locator('#destination-type').selectOption(type); await page.locator('#destination-url').fill(`https://example.com/${type.toLowerCase()}`); await page.locator('#destination-path').fill('/ui'); await page.locator('#add-destination').click();
    }
    await page.locator('#build-output-plan').click(); await expect(page.locator('#destination-list .mini-card')).toHaveCount(7); await expect(page.locator('#output-plan')).toContainText('HUGGINGFACE');
  });

  test('6 referencias: acepta varias URL para réplica', async ({ page }) => {
    await openConfig(page,'references');
    for(const url of ['https://example.com/a','https://example.com/b','https://example.com/c']) { await page.locator('#reference-url').fill(url); await page.locator('#add-reference').click(); }
    await expect(page.locator('#reference-list .mini-card')).toHaveCount(3);
  });

  test('7 web: crea página y la añade al canvas', async ({ page }) => {
    await openConfig(page,'web'); await page.locator('#page-name').fill('Landing principal'); await page.locator('#page-template').selectOption('landing'); await page.locator('#create-page').click();
    await expect(page.locator('#page-list')).toContainText('Landing principal'); await expect(page.locator('.node')).toContainText('Landing principal');
  });

  test('8 media: sube archivo y crea job generativo', async ({ page }) => {
    await openConfig(page,'router'); await page.locator('#model-name').fill('Media AI'); await page.locator('#add-model').click();
    await page.locator('[data-config-tab="media"]').click(); await page.locator('#media-upload').setInputFiles({name:'scene.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('glb')});
    await page.locator('#media-prompt').fill('Crear escena 3D futurista'); await page.locator('#media-type').selectOption('3d'); await page.locator('#queue-media-generation').click();
    await expect(page.locator('#media-list')).toContainText('scene.glb'); await expect(page.locator('#media-list')).toContainText('Crear escena 3D');
  });

  test('9 tema: aplica colores y radio al runtime', async ({ page }) => {
    await openConfig(page,'theme'); await page.locator('#theme-bg').fill('#123456'); await page.locator('#theme-accent').fill('#abcdef'); await page.locator('#theme-radius').fill('14'); await page.locator('#apply-theme').click();
    const css=await page.evaluate(()=>({bg:getComputedStyle(document.documentElement).getPropertyValue('--factory-bg').trim(),radius:getComputedStyle(document.documentElement).getPropertyValue('--factory-radius').trim()}));
    expect(css.bg).toBe('#123456'); expect(css.radius).toBe('14px');
  });

  test('10 micro-kernel: ejecuta validator/version/evidence/queue y registra PASS', async ({ page }) => {
    await openConfig(page,'kernel'); await page.locator('#run-kernel').click(); await expect(page.locator('#kernel-status')).toContainText('"pass": true'); await expect(page.locator('#kernel-status')).toContainText('queue1x1');
  });

  test('IA job: no filtra secretos y queda local si no hay endpoint remoto', async ({ page }) => {
    await openConfig(page,'router'); await page.locator('#model-name').fill('GPT'); await page.locator('#model-secret-ref').fill('secret://gpt'); await page.locator('#add-model').click();
    await page.locator('#toggle-config').click(); await page.locator('#ai-goal').fill('Diseña dashboard'); await page.locator('#send-ai-job').click();
    await expect(page.locator('#delta-preview')).toContainText('QUEUED_LOCAL_NO_REMOTE'); await expect(page.locator('#delta-preview')).toContainText('secret://gpt');
  });

  test('exporta JSON y HTML', async ({ page }) => {
    for(const id of ['export-json','export-html']) { const p=page.waitForEvent('download'); await page.locator(`#${id}`).click(); const d=await p; expect(d.suggestedFilename()).toMatch(/yaiwes-ui-v0\.(json|html)/); }
  });

  test('responsive mantiene superficies sin overflow horizontal', async ({ page }) => {
    await expect(page.locator('.library')).toBeVisible(); const m=await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth})); expect(m.scrollWidth).toBeLessThanOrEqual(m.innerWidth+1);
  });
});
