import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  // site: "https://upl-xi.vercel.app",
  integrations: [tailwind(), mdx(), sitemap(), react()],
  output: "server",
  adapter: vercel(),
});
