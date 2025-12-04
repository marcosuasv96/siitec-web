import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // <--- Importante que esté esta línea

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()] // <--- Importante que esté dentro de integrations
});