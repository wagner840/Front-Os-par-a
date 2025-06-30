# 🚀 Guia Completo de Deploy no Coolify

## 📋 Visão Geral

Este guia te ajudará a fazer deploy da aplicação Next.js no Coolify da sua VPS. O Coolify é uma alternativa open-source ao Vercel/Netlify para self-hosting.

### 💰 Custos Estimados

- **VPS**: $8-15/mês (Hetzner/Digital Ocean)
- **Coolify Cloud**: $5/mês (opcional, ou self-hosted gratuito)
- **Domínio**: $10-15/ano (opcional)

## 🛠️ Pré-requisitos

- [ ] VPS com Ubuntu 20.04+ (mínimo 2GB RAM, 2 vCPU)
- [ ] Domínio configurado (opcional mas recomendado)
- [ ] Repositório GitHub com o projeto
- [ ] Acesso SSH ao servidor

## 📁 Arquivos Necessários

### 1. Dockerfile (Otimizado para Next.js)

```dockerfile
# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG DATABASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NODE_ENV=production

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2. next.config.js (Atualizado)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingRoot: undefined,
  },
  images: {
    domains: [
      "localhost",
      // Adicione outros domínios conforme necessário
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. .dockerignore

```dockerignore
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js build output
.next
out

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Git
.git
.gitignore

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# README and docs
README.md
*.md
docs/

# Tests
__tests__/
*.test.js
*.spec.js
```

### 4. .env.example (Template de Variáveis)

```bash
# ==============================================
# CONFIGURAÇÕES BÁSICAS DA APLICAÇÃO
# ==============================================

# URL da aplicação (será definida automaticamente pelo Coolify)
NEXTAUTH_URL=https://seu-dominio.com
NEXT_PUBLIC_URL=https://seu-dominio.com

# Segredo para NextAuth (gere uma chave segura)
NEXTAUTH_SECRET=sua-chave-secreta-muito-segura-aqui

# ==============================================
# SUPABASE CONFIGURAÇÕES
# ==============================================

# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
# Chave anônima do Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
# Chave de serviço do Supabase (NUNCA EXPONHA PUBLICAMENTE)
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico

# ==============================================
# BANCO DE DADOS
# ==============================================

# URL de conexão com PostgreSQL/Supabase
DATABASE_URL=postgresql://usuario:senha@host:5432/database

# ==============================================
# CONFIGURAÇÕES DE EMAIL (Opcional)
# ==============================================

# Configurações SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app

# ==============================================
# INTEGRAÇÕES EXTERNAS (Opcional)
# ==============================================

# WordPress Integration
WORDPRESS_API_URL=https://seu-wordpress.com/wp-json/wp/v2
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=sua-senha

# N8N Integration
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook

# ==============================================
# CONFIGURAÇÕES DE DESENVOLVIMENTO
# ==============================================

# Modo de desenvolvimento
NODE_ENV=production

# Configurações de debug
DEBUG=false
NEXT_PUBLIC_DEBUG=false

# ==============================================
# ANALYTICS E MONITORAMENTO (Opcional)
# ==============================================

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Posthog
NEXT_PUBLIC_POSTHOG_KEY=sua-chave-posthog
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ==============================================
# CONFIGURAÇÕES DE SEGURANÇA
# ==============================================

# CORS Origins permitidas
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# ==============================================
# CONFIGURAÇÕES DE UPLOAD E STORAGE
# ==============================================

# Tamanho máximo de upload (em bytes)
MAX_FILE_SIZE=10485760

# Tipos de arquivo permitidos
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

## 🚀 Processo de Deploy Passo a Passo

### Etapa 1: Preparar o Repositório

1. **Adicione os arquivos ao seu projeto:**

   ```bash
   # Copie o Dockerfile para a raiz do projeto
   cp Dockerfile ./

   # Copie o .dockerignore
   cp .dockerignore ./

   # Atualize o next.config.js
   cp next.config.js ./

   # Commit e push
   git add .
   git commit -m "feat: add Coolify deployment configuration"
   git push origin main
   ```

### Etapa 2: Configurar VPS (Se necessário)

1. **Instalar Coolify no servidor:**

   ```bash
   # Conectar via SSH
   ssh root@seu-ip-vps

   # Instalar Coolify
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
   ```

2. **Configurar domínio (Opcional):**
   - Aponte seu domínio para o IP da VPS
   - Configure registros DNS A:
     - `@` → IP_DA_VPS
     - `*` → IP_DA_VPS (para subdomínios automáticos)

### Etapa 3: Deploy no Coolify

1. **Acesse o Coolify:**

   - URL: `http://seu-ip-vps:8000` ou `https://seu-dominio.com`

2. **Crie um novo projeto:**

   - Nome: "Front-Os-Parca" ou similar
   - Descrição: "Sistema de gestão de conteúdo e SEO"

3. **Adicione um novo recurso:**

   - Tipo: "Private Repository (with Github App)" ou "Public Repository"
   - Repositório: Seu repositório GitHub
   - Branch: `main`
   - Build Pack: **Dockerfile**

4. **Configure os comandos de build:**
   - **Install Command:** `npm install` ou `yarn install`
   - **Build Command:** `npm run build` ou `yarn build`
   - **Start Command:** `npm start` ou `yarn start`
   - **Port:** `3000`

### Etapa 4: Configurar Variáveis de Ambiente

No painel do Coolify, vá para "Environment Variables" e adicione:

#### Variáveis Obrigatórias:

```bash
NODE_ENV=production
NEXTAUTH_SECRET=gere-uma-chave-segura-de-32-caracteres
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
DATABASE_URL=sua-url-do-banco
```

#### Variáveis que serão definidas automaticamente pelo Coolify:

```bash
# Essas são definidas automaticamente - não adicione manualmente
COOLIFY_FQDN=seu-dominio.com
COOLIFY_URL=https://seu-dominio.com
COOLIFY_BRANCH=main
COOLIFY_CONTAINER_NAME=nome-do-container
```

### Etapa 5: Deploy e Configuração de Domínio

1. **Fazer o primeiro deploy:**

   - Clique em "Deploy"
   - Aguarde o build completar (5-10 minutos)

2. **Configurar domínio personalizado:**

   - Vá para "Domains"
   - Adicione: `seu-dominio.com`
   - Habilite SSL automático (Let's Encrypt)

3. **Atualizar variáveis com domínio:**

   ```bash
   NEXTAUTH_URL=https://seu-dominio.com
   NEXT_PUBLIC_URL=https://seu-dominio.com
   ```

4. **Fazer redeploy:**
   - Clique em "Redeploy" para aplicar as novas variáveis

## 🔧 Scripts Úteis

### package.json (Comandos adicionais)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "build:analyze": "ANALYZE=true npm run build",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## 🔒 Configurações de Segurança

### 1. Firewall (UFW)

```bash
# Permitir apenas portas necessárias
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8000  # Coolify (temporário)
sudo ufw enable
```

### 2. SSL/TLS

- Coolify configura automaticamente SSL com Let's Encrypt
- Certificados renovam automaticamente

### 3. Backup Automático

Configure no Coolify:

- Frequência: Diária
- Retenção: 7 dias
- Incluir: Banco de dados + arquivos

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# No Coolify, acesse "Logs" para ver:
- Build logs
- Application logs
- Error logs
- Access logs
```

### Métricas de Performance

- CPU Usage
- Memory Usage
- Disk Usage
- Network Traffic

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Build falha:**

   ```bash
   # Verifique se todas as dependências estão no package.json
   # Verifique se o Dockerfile está correto
   # Verifique as variáveis de ambiente
   ```

2. **Aplicação não inicia:**

   ```bash
   # Verifique se a porta 3000 está exposta
   # Verifique se o comando start está correto
   # Verifique os logs da aplicação
   ```

3. **Erro de variáveis de ambiente:**
   ```bash
   # Verifique se todas as variáveis obrigatórias estão definidas
   # Verifique se não há espaços ou caracteres especiais
   ```

## 📋 Checklist Final

- [ ] Dockerfile configurado
- [ ] .dockerignore adicionado
- [ ] next.config.js atualizado com output: 'standalone'
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio apontado para VPS (opcional)
- [ ] SSL configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Logs verificados
- [ ] Aplicação funcionando

## 🎉 Conclusão

Após seguir este guia, sua aplicação estará rodando no Coolify com:

- ✅ Deploy automático via Git
- ✅ SSL/HTTPS automático
- ✅ Domínio personalizado
- ✅ Backup automático
- ✅ Monitoramento em tempo real
- ✅ Escalabilidade horizontal

**Custo total estimado:** $13-20/mês para uma aplicação completa com VPS e Coolify Cloud.

### Próximos Passos:

1. Configure CI/CD para deploys automáticos
2. Implemente monitoramento avançado
3. Configure CDN (Cloudflare) para performance global
4. Implemente testes automatizados

---

**Suporte:** Se encontrar problemas, verifique os logs no Coolify ou consulte a [documentação oficial](https://coolify.io/docs).
