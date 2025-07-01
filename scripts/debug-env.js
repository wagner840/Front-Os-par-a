#!/usr/bin/env node

console.log("🔍 DEBUG: Verificando variáveis de ambiente...\n");

// Variáveis essenciais do Supabase
console.log("📊 SUPABASE:");
console.log(
  `  NEXT_PUBLIC_SUPABASE_URL: ${
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Definida" : "❌ Não definida"
  }`
);
console.log(
  `  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✅ Definida"
      : "❌ Não definida"
  }`
);
console.log(
  `  SUPABASE_SERVICE_ROLE_KEY: ${
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Definida" : "❌ Não definida"
  }`
);

// Variáveis do WordPress - Einsof7
console.log("\n🌐 WORDPRESS - EINSOF7:");
console.log(
  `  EINSOF7_WORDPRESS_URL: ${
    process.env.EINSOF7_WORDPRESS_URL || "❌ Não definida"
  }`
);
console.log(
  `  EINSOF7_WORDPRESS_USERNAME: ${
    process.env.EINSOF7_WORDPRESS_USERNAME ? "✅ Definida" : "❌ Não definida"
  }`
);
console.log(
  `  EINSOF7_WORDPRESS_PASSWORD: ${
    process.env.EINSOF7_WORDPRESS_PASSWORD
      ? "✅ Definida (oculta)"
      : "❌ Não definida"
  }`
);

// Variáveis do WordPress - Opetmil
console.log("\n🌐 WORDPRESS - OPETMIL:");
console.log(
  `  OPETMIL_WORDPRESS_URL: ${
    process.env.OPETMIL_WORDPRESS_URL || "❌ Não definida"
  }`
);
console.log(
  `  OPETMIL_WORDPRESS_USERNAME: ${
    process.env.OPETMIL_WORDPRESS_USERNAME ? "✅ Definida" : "❌ Não definida"
  }`
);
console.log(
  `  OPETMIL_WORDPRESS_PASSWORD: ${
    process.env.OPETMIL_WORDPRESS_PASSWORD
      ? "✅ Definida (oculta)"
      : "❌ Não definida"
  }`
);

// Outras variáveis
console.log("\n⚙️  OUTRAS:");
console.log(`  NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(`  PORT: ${process.env.PORT || "3000"}`);
console.log(`  HOSTNAME: ${process.env.HOSTNAME || "localhost"}`);
console.log(
  `  DATABASE_URL: ${
    process.env.DATABASE_URL ? "✅ Definida" : "❌ Não definida"
  }`
);
console.log(`  NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "❌ Não definida"}`);
console.log(
  `  NEXTAUTH_SECRET: ${
    process.env.NEXTAUTH_SECRET ? "✅ Definida" : "❌ Não definida"
  }`
);

// Verificar WordPress configs
console.log("\n🔧 TESTE DE CONFIGURAÇÃO WORDPRESS:");

const { getWordPressConfigFromEnv } = require("../src/lib/wordpress/config");

const einsof7Config = getWordPressConfigFromEnv(
  "718d1bf5-ba1a-4c86-8fa4-c13599eb4952"
);
const opetmilConfig = getWordPressConfigFromEnv(
  "25228f83-0b0d-47c7-926f-1ab6d7255f7b"
);

console.log(
  `  Einsof7 Config: ${
    einsof7Config ? "✅ Configurado via ambiente" : "❌ Não configurado"
  }`
);
console.log(
  `  Opetmil Config: ${
    opetmilConfig ? "✅ Configurado via ambiente" : "❌ Não configurado"
  }`
);

// Resumo
console.log("\n📋 RESUMO:");
const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missingRequired = requiredVars.filter((varName) => !process.env[varName]);

if (missingRequired.length === 0) {
  console.log("✅ Todas as variáveis obrigatórias estão definidas");
} else {
  console.log("❌ Variáveis obrigatórias faltando:");
  missingRequired.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
}

const hasWordPressConfig = einsof7Config || opetmilConfig;
console.log(
  `${hasWordPressConfig ? "✅" : "⚠️"} WordPress: ${
    hasWordPressConfig
      ? "Pelo menos um blog configurado"
      : "Nenhum blog configurado via ambiente"
  }`
);

console.log("\n🚀 Para resolver problemas de login/WordPress:");
console.log("1. Configure as variáveis de ambiente no Coolify");
console.log("2. Reinicie a aplicação");
console.log("3. Verifique os logs da aplicação");
console.log("4. Teste a conexão WordPress na interface");
