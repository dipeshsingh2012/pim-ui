import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'node:dns';
import https from 'node:https';

// In WSL and containerized environments, the default DNS resolver (e.g. 10.255.255.254)
// can refuse or fail queries for *.run.app hostnames (EAI_AGAIN), causing Vite proxy 500 errors.
// This custom agent falls back to public DNS resolvers (8.8.8.8, 1.1.1.1) to guarantee connectivity.
const resolver = new dns.Resolver();
try {
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback if network interface restricts custom nameservers
}

function resilientLookup(
  hostname: string,
  options: any,
  callback: (err: NodeJS.ErrnoException | null, address: any, family?: number) => void
) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dns.lookup(hostname, options, (err, address, family) => {
    if (!err) return callback(null, address, family);
    resolver.resolve4(hostname, (resErr, addresses) => {
      if (resErr || !addresses || addresses.length === 0) return callback(err);
      if (options && options.all) {
        return callback(null, addresses.map((addr) => ({ address: addr, family: 4 })));
      }
      callback(null, addresses[0], 4);
    });
  });
}

const proxyAgent = new https.Agent({ lookup: resilientLookup, keepAlive: true });

const proxyConfig = {
  '/api/catalog': {
    target: 'https://product-catalog-service-518971663061.us-central1.run.app',
    changeOrigin: true,
    agent: proxyAgent,
    rewrite: (path: string) => path.replace(/^\/api\/catalog(\/api\/v1)?/, '/api/v1'),
    secure: false,
  },
  '/api/content': {
    target: 'https://content-service-518971663061.us-central1.run.app',
    changeOrigin: true,
    agent: proxyAgent,
    rewrite: (path: string) => path.replace(/^\/api\/content(\/api\/v1)?/, '/api/v1'),
    secure: false,
  },
};

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5180,
    host: '0.0.0.0',
    proxy: proxyConfig,
  },
  preview: {
    port: 5180,
    host: '0.0.0.0',
    proxy: proxyConfig,
  },
});
