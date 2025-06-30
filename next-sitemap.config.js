/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://your-domain.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/api/*", "/admin/*", "/login", "/dashboard/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/login"],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || "https://your-domain.com"}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "daily",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
