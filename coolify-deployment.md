# 🚀 Guia de Deploy no Coolify - Front-Os-Parça

## 📋 Resumo Executivo

Este guia te levará do zero ao deploy completo no Coolify em **menos de 30 minutos**.

### 💰 Custos Totais

- **VPS Hetzner**: €4.90/mês (2vCPU, 4GB RAM)
- **Coolify Cloud**: $5/mês (ou gratuito self-hosted)
- **Domínio**: $10-15/ano (opcional)
- **Total**: ~$15/mês

## 🛠️ Arquivos Necessários

### 1. Dockerfile (Copie para raiz do projeto)

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NODE_ENV=production

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Atualize next.config.js

Adicione esta linha no início do seu next.config.js:

```javascript
const nextConfig = {
  output: "standalone", // ← ADICIONE ESTA LINHA
  // ... resto das suas configurações
};
```

### 3. .dockerignore

```
node_modules
.next
.env*
.git
.vscode
*.log
README.md
docs/
```

## 🚀 Deploy Passo a Passo

### Etapa 1: Preparar Repositório (2 min)

```bash
# Adicionar arquivos ao projeto
git add Dockerfile .dockerignore
git commit -m "feat: add Coolify deployment files"
git push origin main
```

### Etapa 2: Configurar VPS (10 min)

1. **Compre VPS na Hetzner** (€4.90/mês):

   - 2 vCPU, 4GB RAM, 40GB SSD
   - Ubuntu 22.04
   - Anote o IP

2. **Instale Coolify**:

   ```bash
   ssh root@SEU_IP_VPS
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
   ```

3. **Configure domínio** (opcional):
   - Aponte `A record` para IP da VPS
   - `*.seudominio.com` → IP_VPS

### Etapa 3: Deploy no Coolify (10 min)

1. **Acesse Coolify**: `http://SEU_IP_VPS:8000`

2. **Crie projeto**:

   - Nome: "Front-Os-Parca"
   - Ambiente: Production

3. **Adicione aplicação**:

   - Tipo: "Public Repository" ou "Private (with GitHub App)"
   - URL: `https://github.com/seu-usuario/Front-Os-par-a`
   - Branch: `main`
   - Build Pack: **Dockerfile**

4. **Configure build**:
   - Install: `npm install`
   - Build: `npm run build`
   - Start: `npm start`
   - Port: `3000`

### Etapa 4: Variáveis de Ambiente (5 min)

Na aba "Environment Variables" do Coolify, adicione:

```bash
# OBRIGATÓRIAS
NODE_ENV=production
NEXTAUTH_SECRET=gere-uma-chave-de-32-caracteres-aqui
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico

# OPCIONAIS (adicione conforme necessário)
DATABASE_URL=sua-url-do-banco
WORDPRESS_API_URL=https://seu-wordpress.com/wp-json/wp/v2
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook
```

### Etapa 5: Deploy e Configurar Domínio (3 min)

1. **Clique em "Deploy"** - aguarde 5-10 minutos

2. **Configure domínio**:

   - Vá em "Domains"
   - Adicione: `seudominio.com`
   - Habilite SSL automático

3. **Atualize variáveis**:

   ```bash
   NEXTAUTH_URL=https://seudominio.com
   NEXT_PUBLIC_URL=https://seudominio.com
   ```

4. **Redeploy** - clique em "Redeploy"

## ✅ Checklist de Verificação

- [ ] Dockerfile criado na raiz
- [ ] next.config.js com `output: 'standalone'`
- [ ] .dockerignore configurado
- [ ] Variáveis de ambiente definidas
- [ ] Build completou sem erros
- [ ] Aplicação acessível via URL
- [ ] SSL funcionando (https://)

## 🔧 Comandos Úteis

### Verificar logs:

```bash
# No Coolify, vá em "Logs" para ver:
- Build logs
- Application logs
- Error logs
```

### Gerar NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### Testar localmente com Docker:

```bash
docker build -t front-os-parca .
docker run -p 3000:3000 front-os-parca
```

## 🚨 Solução de Problemas

### Build falha:

- ✅ Verifique se `output: 'standalone'` está no next.config.js
- ✅ Verifique se todas as dependências estão no package.json
- ✅ Verifique os logs de build no Coolify

### App não inicia:

- ✅ Verifique se a porta 3000 está exposta
- ✅ Verifique as variáveis de ambiente obrigatórias
- ✅ Verifique os logs da aplicação

### Erro 500:

- ✅ Verifique se NEXTAUTH_SECRET está definido
- ✅ Verifique se URLs do Supabase estão corretas
- ✅ Verifique conexão com banco de dados

## 🎯 Automação CI/CD

Para deploys automáticos, configure webhook no GitHub:

1. No Coolify, vá em "Webhooks"
2. Copie a URL do webhook
3. No GitHub: Settings → Webhooks → Add webhook
4. Cole a URL e selecione "push" events

## 🔒 Backup e Segurança

### Configurar backup automático:

```bash
# No Coolify:
1. Vá em "Backups"
2. Configure frequência: Diária
3. Retenção: 7 dias
4. Teste a restauração
```

### Firewall básico:

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8000  # Coolify
sudo ufw enable
```

## 📊 Monitoramento

O Coolify fornece automaticamente:

- ✅ Métricas de CPU/RAM
- ✅ Logs em tempo real
- ✅ Status de saúde da aplicação
- ✅ Alertas por email (configurável)

## 🎉 Resultado Final

Após seguir este guia, você terá:

- ✅ Aplicação rodando em produção
- ✅ HTTPS automático com Let's Encrypt
- ✅ Deploy automático via Git push
- ✅ Backup automático configurado
- ✅ Monitoramento em tempo real
- ✅ Domínio personalizado (opcional)

**Tempo total de setup**: ~30 minutos
**Custo mensal**: ~$15 (incluindo VPS + Coolify Cloud)

---

## 📞 Suporte

Se encontrar problemas:

1. **Logs do Coolify**: Sempre verifique primeiro
2. **Documentação**: https://coolify.io/docs
3. **Discord Coolify**: Comunidade muito ativa
4. **GitHub Issues**: Para bugs específicos

**Próximos passos sugeridos**:

- Configure CDN (Cloudflare) para performance global
- Implemente monitoramento avançado (Uptime Robot)
- Configure testes automatizados
- Adicione staging environment
