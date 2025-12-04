// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless'

import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server', 
  adapter: vercel(),
  integrations: [tailwind()],
});