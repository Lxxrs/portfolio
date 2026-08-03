/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  { test: {/* Vitest configuration options */} },
  {
    site: "https://larmart.de/",
    trailingSlash: "always",
  },
);
