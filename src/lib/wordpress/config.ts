import type { WordPressConfig } from "@/lib/types/wordpress";

// IDs dos blogs (vindos do banco de dados)
export const BLOG_IDS = {
  EINSOF7: "718d1bf5-ba1a-4c86-8fa4-c13599eb4952",
  OPETMIL: "25228f83-0b0d-47c7-926f-1ab6d7255f7b",
} as const;

// Mapeamento dos domínios para facilitar uso
export const BLOG_DOMAINS = {
  "einsof7.com": BLOG_IDS.EINSOF7,
  "opetmil.com": BLOG_IDS.OPETMIL,
} as const;

// Nomes amigáveis dos blogs
export const BLOG_NAMES = {
  [BLOG_IDS.EINSOF7]: "Einsof7",
  [BLOG_IDS.OPETMIL]: "Opetmil",
} as const;

/**
 * Configuração WordPress baseada em variáveis de ambiente (Coolify/Docker)
 * Essas configurações têm prioridade sobre as salvas no banco
 */
export function getWordPressConfigFromEnv(
  blogId: string
): WordPressConfig | null {
  try {
    let envPrefix: string;

    // Determinar o prefixo da variável de ambiente baseado no blog ID
    switch (blogId) {
      case BLOG_IDS.EINSOF7:
        envPrefix = "EINSOF7";
        break;
      case BLOG_IDS.OPETMIL:
        envPrefix = "OPETMIL";
        break;
      default:
        return null;
    }

    const baseUrl = process.env[`${envPrefix}_WORDPRESS_URL`];
    const username = process.env[`${envPrefix}_WORDPRESS_USERNAME`];
    const password = process.env[`${envPrefix}_WORDPRESS_PASSWORD`];

    // Se não tiver as variáveis obrigatórias, retorna null
    if (!baseUrl || !username || !password) {
      return null;
    }

    return {
      base_url: baseUrl,
      username: username,
      app_password: password,
      sync_enabled:
        process.env[`${envPrefix}_WORDPRESS_SYNC_ENABLED`] === "true" || true,
      auto_sync_interval: parseInt(
        process.env[`${envPrefix}_WORDPRESS_SYNC_INTERVAL`] || "60"
      ),
      sync_categories:
        process.env[`${envPrefix}_WORDPRESS_SYNC_CATEGORIES`] === "true" ||
        true,
      sync_tags:
        process.env[`${envPrefix}_WORDPRESS_SYNC_TAGS`] === "true" || true,
      sync_media:
        process.env[`${envPrefix}_WORDPRESS_SYNC_MEDIA`] === "true" || true,
      sync_comments:
        process.env[`${envPrefix}_WORDPRESS_SYNC_COMMENTS`] === "true" || false,
      backup_enabled:
        process.env[`${envPrefix}_WORDPRESS_BACKUP_ENABLED`] === "true" ||
        false,
      backup_frequency:
        (process.env[`${envPrefix}_WORDPRESS_BACKUP_FREQUENCY`] as any) ||
        "daily",
    };
  } catch (error) {
    console.error(
      `Erro ao carregar configuração do ambiente para blog ${blogId}:`,
      error
    );
    return null;
  }
}

/**
 * Obter configuração WordPress por blog ID
 * Prioriza variáveis de ambiente sobre configurações do banco
 */
export function getWordPressConfigByBlogId(
  blogId: string
): WordPressConfig | null {
  // Primeira tentativa: variáveis de ambiente (Coolify/Docker)
  const envConfig = getWordPressConfigFromEnv(blogId);
  if (envConfig) {
    return envConfig;
  }

  // Se não encontrou nas variáveis de ambiente, retorna null
  // O service existente continuará funcionando e buscará do banco
  return null;
}

/**
 * Obter configuração WordPress por domínio
 */
export function getWordPressConfigByDomain(
  domain: string
): WordPressConfig | null {
  const blogId = BLOG_DOMAINS[domain as keyof typeof BLOG_DOMAINS];
  if (!blogId) {
    return null;
  }

  return getWordPressConfigByBlogId(blogId);
}

/**
 * Verificar se um blog ID é válido
 */
export function isValidBlogId(blogId: string): boolean {
  return Object.values(BLOG_IDS).includes(blogId as any);
}

/**
 * Obter nome amigável do blog
 */
export function getBlogName(blogId: string): string {
  return BLOG_NAMES[blogId as keyof typeof BLOG_NAMES] || "Blog Desconhecido";
}

/**
 * Listar todos os blogs configurados
 */
export function getAllBlogConfigs(): Array<{
  blogId: string;
  name: string;
  config: WordPressConfig | null;
}> {
  return Object.entries(BLOG_IDS).map(([name, blogId]) => ({
    blogId,
    name: BLOG_NAMES[blogId],
    config: getWordPressConfigByBlogId(blogId),
  }));
}

/**
 * Debug: verificar quais configurações estão disponíveis
 */
export function debugWordPressConfigs(): void {
  if (typeof window !== "undefined") return; // Só rodar no servidor

  console.log("🔍 WordPress Configurations Debug:");

  Object.entries(BLOG_IDS).forEach(([name, blogId]) => {
    const envConfig = getWordPressConfigFromEnv(blogId);
    console.log(`📝 ${name} (${blogId}):`);
    console.log(
      `  - Environment Config: ${envConfig ? "✅ Found" : "❌ Not found"}`
    );
    if (envConfig) {
      console.log(`  - URL: ${envConfig.base_url}`);
      console.log(`  - Username: ${envConfig.username}`);
      console.log(`  - Sync Enabled: ${envConfig.sync_enabled}`);
    }
  });
}

// Verificar configurações no desenvolvimento
if (process.env.NODE_ENV === "development") {
  debugWordPressConfigs();
}
