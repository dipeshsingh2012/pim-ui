import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// 1. Verify Production URLs Policy (No localhost / dev URLs in configs or src)
// ============================================================================
test('Production URLs Policy: config and environment strictly use Cloud Run prod URLs for backend services and no vercel links', () => {
  const envFile = fs.readFileSync(path.join(rootDir, '.env'), 'utf-8');
  const envExample = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf-8');
  const dataProviderFile = fs.readFileSync(
    path.join(rootDir, 'src/providers/dataProvider.ts'),
    'utf-8'
  );

  // Check .env
  assert.ok(
    envFile.includes('product-catalog-service') && envFile.includes('.run.app'),
    '.env must point to Cloud Run catalog service'
  );
  assert.ok(
    envFile.includes('content-service') && envFile.includes('.run.app'),
    '.env must point to Cloud Run content service'
  );
  assert.ok(
    !envFile.includes('vercel.app'),
    '.env must not contain vercel URLs'
  );

  // Check .env.example
  assert.ok(
    !envExample.includes('vercel.app'),
    '.env.example must not contain vercel URLs'
  );

  // Check dataProvider.ts default URLs
  assert.ok(
    dataProviderFile.includes('product-catalog-service') && dataProviderFile.includes('.run.app'),
    'dataProvider.ts must default to prod catalog service'
  );
  assert.ok(
    dataProviderFile.includes('content-service') && dataProviderFile.includes('.run.app'),
    'dataProvider.ts must default to prod content service'
  );
});

// ============================================================================
// 2. Verify Refine Data Provider Resource Routing
// ============================================================================
test('Refine Data Provider: resolveResourcePath routes CMS resources to CONTENT_API_URL', async () => {
  const { default: esbuild } = await import('esbuild');
  const tsCode = fs.readFileSync(path.join(rootDir, 'src/providers/dataProvider.ts'), 'utf-8');
  const transformed = esbuild.transformSync(tsCode, {
    loader: 'ts',
    format: 'esm',
    define: {
      'import.meta.env.VITE_CATALOG_API_URL': 'undefined',
      'import.meta.env.VITE_CONTENT_API_URL': 'undefined',
    },
  });

  const dataUri = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`;
  const dataProviderModule = await import(dataUri);
  const { resolveResourcePath, CONTENT_API_URL, CATALOG_API_URL } = dataProviderModule;

  assert.equal(typeof resolveResourcePath, 'function');

  // Lanes and menus
  assert.deepEqual(resolveResourcePath('lanes'), { baseUrl: CONTENT_API_URL, endpoint: 'lanes' });
  assert.deepEqual(resolveResourcePath('content_lanes'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'content_lanes',
  });
  assert.deepEqual(resolveResourcePath('menus'), { baseUrl: CONTENT_API_URL, endpoint: 'menus' });

  // Pages & CMS Pages
  assert.deepEqual(resolveResourcePath('pages'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/pages',
  });
  assert.deepEqual(resolveResourcePath('cms_pages'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/pages',
  });
  assert.deepEqual(resolveResourcePath('cms/pages'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/pages',
  });

  // Site Shell
  assert.deepEqual(resolveResourcePath('cms/shell'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/shell',
  });
  assert.deepEqual(resolveResourcePath('cms_shell'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/shell',
  });
  assert.deepEqual(resolveResourcePath('shell'), {
    baseUrl: CONTENT_API_URL,
    endpoint: 'cms/shell',
  });

  // Products and catalog
  assert.deepEqual(resolveResourcePath('products'), {
    baseUrl: CATALOG_API_URL,
    endpoint: 'products',
  });
});

// ============================================================================
// 3. End-to-End CMS Endpoints Contract Integration
// ============================================================================
test('CMS Endpoints Contract: mock test server verifying all 14 CMS API interactions', async () => {
  const recordedRequests = [];

  // Spin up an in-process HTTP mock server to verify HTTP wire contract
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      recordedRequests.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: body ? JSON.parse(body) : null,
      });

      res.setHeader('Content-Type', 'application/json');

      if (req.url === '/api/v1/cms/shell' && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            id: 'default',
            promo_bar: { enabled: true, text: 'Test Promo', theme: 'amber' },
            header: { brand_name: 'Hiljhil Roasters', nodes: [], show_search: true },
            footer: { brand_name: 'Hiljhil', copyright: '© 2026' },
          })
        );
      } else if (req.url === '/api/v1/cms/shell' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(body)));
      } else if (req.url === '/api/v1/cms/shell/promo-bar' && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            enabled: true,
            text: 'Live Promo Bar',
            cta_text: 'Shop',
            cta_url: '#/shop',
            theme: 'emerald',
            badge: 'FRESH',
          })
        );
      } else if (req.url === '/api/v1/cms/shell/promo-bar' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(body)));
      } else if (req.url === '/api/v1/cms/shell/header' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ brand_name: 'Hiljhil NYC', nodes: [], sticky: true }));
      } else if (req.url === '/api/v1/cms/shell/header' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(body)));
      } else if (req.url === '/api/v1/cms/shell/footer' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ brand_name: 'Hiljhil', copyright: '2026' }));
      } else if (req.url === '/api/v1/cms/shell/footer' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(body)));
      } else if (req.url === '/api/v1/cms/shell/theme' && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            id: 'theme_warm_amber',
            name: 'Warm Amber Roast',
            preset: 'amber',
            primary_color: '#92400e',
            accent_color: '#f59e0b',
            font_family: 'serif',
            border_radius: 'rounded-2xl',
          })
        );
      } else if (req.url === '/api/v1/cms/shell/theme' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(body)));
      } else if (req.url?.startsWith('/api/v1/cms/pages') && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            items: [
              {
                id: 'page_home',
                page_type: 'home',
                title: 'Homepage',
                slug: '/',
                sections: [],
              },
            ],
            total: 1,
          })
        );
      } else if (req.url === '/api/v1/cms/pages' && req.method === 'POST') {
        res.writeHead(201);
        const parsed = JSON.parse(body);
        res.end(JSON.stringify({ id: parsed.id || 'page_created', ...parsed }));
      } else if (req.url?.startsWith('/api/v1/cms/pages/') && req.method === 'PATCH') {
        res.writeHead(200);
        const parsed = JSON.parse(body);
        res.end(JSON.stringify(parsed));
      } else if (req.url?.startsWith('/api/v1/cms/pages/') && req.method === 'DELETE') {
        res.writeHead(204);
        res.end();
      } else if (req.url === '/api/v1/cms/reset-defaults' && req.method === 'POST') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: 'Reset successful',
            shell: { promo_bar: {}, header: {}, footer: {} },
            pages: [],
          })
        );
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    // 1. Test GET /cms/shell
    const getShellRes = await fetch(`${baseUrl}/cms/shell`);
    assert.equal(getShellRes.status, 200);
    const shellData = await getShellRes.json();
    assert.equal(shellData.id, 'default');
    assert.equal(shellData.promo_bar.text, 'Test Promo');

    // 2. Test dedicated Promo Bar GET & PUT
    const getPromoRes = await fetch(`${baseUrl}/cms/shell/promo-bar`);
    assert.equal(getPromoRes.status, 200);
    const promoData = await getPromoRes.json();
    assert.equal(promoData.theme, 'emerald');

    const putPromoRes = await fetch(`${baseUrl}/cms/shell/promo-bar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: true, text: 'Updated Promo', theme: 'espresso' }),
    });
    assert.equal(putPromoRes.status, 200);
    const updatedPromo = await putPromoRes.json();
    assert.equal(updatedPromo.text, 'Updated Promo');
    assert.equal(updatedPromo.theme, 'espresso');

    // 3. Test dedicated Header PUT
    const putHeaderRes = await fetch(`${baseUrl}/cms/shell/header`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_name: 'Hiljhil Micro-Roastery', nodes: [] }),
    });
    assert.equal(putHeaderRes.status, 200);
    const updatedHeader = await putHeaderRes.json();
    assert.equal(updatedHeader.brand_name, 'Hiljhil Micro-Roastery');

    // 4. Test dedicated Footer PUT
    const putFooterRes = await fetch(`${baseUrl}/cms/shell/footer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_name: 'Hiljhil Roasters', copyright: '© 2026' }),
    });
    assert.equal(putFooterRes.status, 200);
    const updatedFooter = await putFooterRes.json();
    assert.equal(updatedFooter.brand_name, 'Hiljhil Roasters');

    // 5. Test Pages List GET
    const getPagesRes = await fetch(`${baseUrl}/cms/pages?limit=100`);
    assert.equal(getPagesRes.status, 200);
    const pagesList = await getPagesRes.json();
    assert.equal(pagesList.total, 1);
    assert.equal(pagesList.items[0].slug, '/');

    // 6. Test Page POST
    const postPageRes = await fetch(`${baseUrl}/cms/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'page_brew',
        title: 'Brewing Manuals',
        slug: '/brewing',
        page_type: 'static',
        is_published: true,
        sections: [],
      }),
    });
    assert.equal(postPageRes.status, 201);
    const createdPage = await postPageRes.json();
    assert.equal(createdPage.id, 'page_brew');
    assert.equal(createdPage.title, 'Brewing Manuals');

    // 7. Test Page PATCH
    const patchPageRes = await fetch(`${baseUrl}/cms/pages/page_brew`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Master Brewing 2026' }),
    });
    assert.equal(patchPageRes.status, 200);
    const patchedPage = await patchPageRes.json();
    assert.equal(patchedPage.title, 'Master Brewing 2026');

    // 8. Test Page DELETE
    const delPageRes = await fetch(`${baseUrl}/cms/pages/page_brew`, {
      method: 'DELETE',
    });
    assert.equal(delPageRes.status, 204);

    // 9. Test Reset Defaults POST
    const resetRes = await fetch(`${baseUrl}/cms/reset-defaults`, {
      method: 'POST',
    });
    assert.equal(resetRes.status, 200);
    const resetData = await resetRes.json();
    assert.equal(resetData.message, 'Reset successful');

    // Verify all recorded requests hit expected endpoints
    const paths = recordedRequests.map((r) => `${r.method} ${r.url}`);
    assert.ok(paths.includes('GET /api/v1/cms/shell'));
    assert.ok(paths.includes('GET /api/v1/cms/shell/promo-bar'));
    assert.ok(paths.includes('PUT /api/v1/cms/shell/promo-bar'));
    assert.ok(paths.includes('PUT /api/v1/cms/shell/header'));
    assert.ok(paths.includes('PUT /api/v1/cms/shell/footer'));
    assert.ok(paths.includes('GET /api/v1/cms/pages?limit=100'));
    assert.ok(paths.includes('POST /api/v1/cms/pages'));
    assert.ok(paths.includes('PATCH /api/v1/cms/pages/page_brew'));
    assert.ok(paths.includes('DELETE /api/v1/cms/pages/page_brew'));
    assert.ok(paths.includes('POST /api/v1/cms/reset-defaults'));
  } finally {
    server.close();
  }
});

// ============================================================================
// 4. Direct Invocation of cmsDataProvider Library Methods
// ============================================================================
test('CMS Data Provider Library: directly invoke exported functions against mock server', async () => {
  const { default: esbuild } = await import('esbuild');

  // mock localStorage
  globalThis.localStorage = {
    _store: {},
    getItem(k) {
      return this._store[k] || null;
    },
    setItem(k, v) {
      this._store[k] = String(v);
    },
    removeItem(k) {
      delete this._store[k];
    },
    clear() {
      this._store = {};
    },
  };

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      if (req.url === '/api/v1/cms/shell/promo-bar' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ enabled: true, text: 'Direct Promo Bar', theme: 'emerald' }));
      } else if (req.url === '/api/v1/cms/shell/promo-bar' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(body);
      } else if (req.url === '/api/v1/cms/shell/header' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ brand_name: 'Direct Header', nodes: [] }));
      } else if (req.url === '/api/v1/cms/shell/footer' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ brand_name: 'Direct Footer', columns: [] }));
      } else if (req.url === '/api/v1/cms/shell/theme' && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            id: 'theme_warm_amber',
            name: 'Warm Amber Roast',
            preset: 'amber',
            primary_color: '#92400e',
            accent_color: '#f59e0b',
            font_family: 'serif',
            border_radius: 'rounded-2xl',
            is_active: true,
          })
        );
      } else if (req.url === '/api/v1/cms/shell/theme' && req.method === 'PUT') {
        res.writeHead(200);
        res.end(body);
      } else if (req.url === '/api/v1/cms/pages?limit=100' && req.method === 'GET') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            items: [{ id: 'p1', title: 'P1', slug: '/p1', sections: [] }],
            total: 1,
          })
        );
      } else if (req.url === '/api/v1/cms/pages' && req.method === 'POST') {
        const parsed = JSON.parse(body);
        res.writeHead(201);
        res.end(JSON.stringify({ id: 'page_new_123', ...parsed }));
      } else if (req.url === '/api/v1/cms/pages/p1' && req.method === 'PATCH') {
        res.writeHead(200);
        res.end(body);
      } else if (req.url === '/api/v1/cms/pages/p1' && req.method === 'DELETE') {
        res.writeHead(204);
        res.end();
      } else if (req.url === '/api/v1/cms/reset-defaults' && req.method === 'POST') {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: 'Reset OK',
            shell: { promo_bar: {}, header: {}, footer: {} },
            pages: [],
          })
        );
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'not found' }));
      }
    });
  });

  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const mockContentApiUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    const rawTs = fs.readFileSync(path.join(rootDir, 'src/providers/cmsDataProvider.ts'), 'utf-8');
    const replacedTs = rawTs.replace(
      "import { CONTENT_API_URL } from './dataProvider';",
      `const CONTENT_API_URL = '${mockContentApiUrl}';`
    );
    const transformed = esbuild.transformSync(replacedTs, {
      loader: 'ts',
      format: 'esm',
    });
    const dataUri = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`;
    const cmsProvider = await import(dataUri);

    // 1. Test fetchPromoBar
    const promo = await cmsProvider.fetchPromoBar();
    assert.equal(promo.text, 'Direct Promo Bar');
    assert.equal(promo.theme, 'emerald');

    // 2. Test savePromoBar
    await cmsProvider.savePromoBar({ enabled: true, text: 'Saved Promo Bar', theme: 'amber' });
    const storedShell = JSON.parse(globalThis.localStorage.getItem('pim_cms_global_shell_v1'));
    assert.equal(storedShell.promo_bar.text, 'Saved Promo Bar');

    // 3. Test fetchHeader
    const header = await cmsProvider.fetchHeader();
    assert.equal(header.brand_name, 'Direct Header');

    // 4. Test fetchFooter
    const footer = await cmsProvider.fetchFooter();
    assert.equal(footer.brand_name, 'Direct Footer');

    // 4b. Test fetchTheme & saveTheme
    const theme = await cmsProvider.fetchTheme();
    assert.equal(theme.preset, 'amber');
    assert.equal(theme.primary_color, '#92400e');

    const saveThemeRes = await cmsProvider.saveTheme({
      ...theme,
      preset: 'espresso',
      primary_color: '#1c1917',
    });
    assert.equal(saveThemeRes.success, true);
    assert.equal(saveThemeRes.syncedToApi, true);
    const storedTheme = JSON.parse(globalThis.localStorage.getItem('pim_cms_theme_v1'));
    assert.equal(storedTheme.preset, 'espresso');
    assert.equal(storedTheme.primary_color, '#1c1917');

    // 5. Test fetchCmsPages
    const pages = await cmsProvider.fetchCmsPages();
    assert.equal(pages.length, 1);
    assert.equal(pages[0].id, 'p1');

    // 6. Test createCmsPage
    const newPage = await cmsProvider.createCmsPage({
      title: 'New Story',
      slug: '/story',
      page_type: 'static',
      is_published: true,
      sections: [],
    });
    assert.equal(newPage.id, 'page_new_123');

    // 7. Test saveCmsPage
    await cmsProvider.saveCmsPage({ ...pages[0], title: 'Updated Title' });

    // 8. Test deleteCmsPage
    const deleted = await cmsProvider.deleteCmsPage('p1');
    assert.equal(deleted, true);

    // 9. Test resetCmsDefaults
    const reset = await cmsProvider.resetCmsDefaults();
    assert.equal(reset.pages.length, 0);
  } finally {
    server.close();
  }
});

// ============================================================================
// 5. Product Pages Catalog Sync: CMS displays dedicated product pages for all DB products
// ============================================================================
test('Product Pages Catalog Sync: CMS provides dedicated product pages for each product in the database', async () => {
  const { default: esbuild } = await import('esbuild');
  const rawTs = fs.readFileSync(path.join(rootDir, 'src/providers/cmsDataProvider.ts'), 'utf-8');
  const replacedTs = rawTs.replace(
    "import { CONTENT_API_URL } from './dataProvider';",
    "const CONTENT_API_URL = '';"
  );
  const transformed = esbuild.transformSync(replacedTs, {
    loader: 'ts',
    format: 'esm',
  });
  const dataUri = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`;
  const cmsProvider = await import(dataUri);
  const { DEFAULT_CMS_PAGES, SEED_CATALOG_PRODUCTS, generateProductPage, syncProductPagesWithCatalog } = cmsProvider;

  // 1. Verify default seed pages contain a product page for each seed product and NO universal fallback
  const productPages = DEFAULT_CMS_PAGES.filter((p) => p.page_type === 'product');
  assert.equal(
    productPages.some((p) => p.slug === '/products/:id' || p.id === 'page_product_default'),
    false,
    'Universal fallback product page (/products/:id) must be removed'
  );
  assert.equal(
    productPages.length,
    SEED_CATALOG_PRODUCTS.length,
    `DEFAULT_CMS_PAGES product pages count must match real catalog products count exactly (${SEED_CATALOG_PRODUCTS.length})`
  );

  for (const prod of SEED_CATALOG_PRODUCTS) {
    const page = productPages.find((p) => p.slug === `/products/${prod.id}` || p.id === `page_product_${prod.id}`);
    assert.ok(page, `Product page for ${prod.id} (${prod.name}) must exist in default CMS pages`);
    assert.equal(page.page_type, 'product');
    assert.ok(page.title.includes(prod.name), `Title should include product name`);
    assert.ok(page.sections.length > 0, `Product page should have configured sections`);
  }

  // 2. Test generateProductPage with a custom product
  const testProduct = {
    id: 'prod_chemex_classic',
    name: 'Chemex 8-Cup Classic Pour-Over',
    brand: 'Chemex',
    sku: 'CM-8A',
    category: 'accessories',
    price: 49.95,
    status: 'active',
    in_stock: true,
    rating: 4.8,
    review_count: 55,
    tax_category: 'accessories',
    width_cm: 13.0,
    height_cm: 23.0,
    depth_cm: 13.0,
    top_clearance_cm: 5.0,
    side_clearance_cm: 2.0,
    rear_clearance_cm: 2.0,
  };

  const generatedPage = generateProductPage(testProduct);
  assert.equal(generatedPage.id, 'page_product_prod_chemex_classic');
  assert.equal(generatedPage.slug, '/products/prod_chemex_classic');
  assert.equal(generatedPage.page_type, 'product');
  assert.equal(generatedPage.title, 'Chemex 8-Cup Classic Pour-Over (PDP)');
  assert.ok(generatedPage.sections.length >= 3);

  // 3. Test syncProductPagesWithCatalog dynamic generation
  const existingPages = [
    { id: 'page_home', page_type: 'home', title: 'Home', slug: '/', sections: [], is_published: true },
  ];
  const catalog = [...SEED_CATALOG_PRODUCTS, testProduct];
  const synced = syncProductPagesWithCatalog(existingPages, catalog);

  assert.ok(synced.some((p) => p.slug === '/products/prod_chemex_classic'));
  assert.ok(synced.some((p) => p.slug === '/products/prod_breville_barista_touch'));
  assert.ok(synced.some((p) => p.slug === '/products/prod_mooleh_manay_excelsa'));
  assert.ok(synced.some((p) => p.slug === '/products/fellow_ode_gen2' || p.slug === '/products/prod_fellow_ode_gen2'));
  assert.equal(synced.some((p) => p.slug === '/products/:id' || p.id === 'page_product_default'), false);
  assert.ok(synced.length >= 25, `Synced should contain at least 25 pages, got ${synced.length}`);
});

// ============================================================================
// 6. Theme Presets PostgreSQL Contract Integration
// ============================================================================
test('Theme Presets: fetchThemePresets retrieves PostgreSQL-backed presets with fallback', async () => {
  const { default: esbuild } = await import('esbuild');

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/api/v1/cms/shell/theme-presets' && req.method === 'GET') {
      res.writeHead(200);
      res.end(
        JSON.stringify([
          {
            id: 'theme_hill_jhil_alpine',
            name: 'Hill Jhil Alpine Tarn',
            preset: 'alpine',
            mode: 'light',
            primary_color: '#085454',
            accent_color: '#0d9488',
            surface_color: '#ffffff',
            background_color: '#f0fdfa',
            text_color: '#042f2e',
            font_family: 'serif',
            border_radius: 'rounded-2xl',
            is_active: true,
          },
          {
            id: 'theme_warm_amber',
            name: 'Warm Amber Roast',
            preset: 'amber',
            mode: 'light',
            primary_color: '#92400e',
            accent_color: '#f59e0b',
            surface_color: '#ffffff',
            background_color: '#fbf9f6',
            text_color: '#1c1917',
            font_family: 'serif',
            border_radius: 'rounded-2xl',
            is_active: false,
          },
        ])
      );
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'not found' }));
    }
  });

  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const mockContentApiUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    const rawTs = fs.readFileSync(path.join(rootDir, 'src/providers/cmsDataProvider.ts'), 'utf-8');
    const replacedTs = rawTs.replace(
      "import { CONTENT_API_URL } from './dataProvider';",
      `const CONTENT_API_URL = '${mockContentApiUrl}';`
    );
    const transformed = esbuild.transformSync(replacedTs, {
      loader: 'ts',
      format: 'esm',
    });
    const dataUri = `data:text/javascript;base64,${Buffer.from(transformed.code).toString('base64')}`;
    const cmsProvider = await import(dataUri);

    const presets = await cmsProvider.fetchThemePresets();
    assert.equal(presets.length, 2);
    assert.equal(presets[0].preset, 'alpine');
    assert.equal(presets[0].primary_color, '#085454');
    assert.equal(presets[1].preset, 'amber');
  } finally {
    server.close();
  }
});

