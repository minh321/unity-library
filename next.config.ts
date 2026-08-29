import type { NextConfig } from "next";

/**
 * GitHub Pages project sites live at https://<user>.github.io/<repo>/.
 * The workflow sets BASE_PATH=/<repo>. A user site named <user>.github.io leaves it empty.
 */
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") || "";
const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

if (githubPages) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
}

if (basePath) {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

export default nextConfig;
