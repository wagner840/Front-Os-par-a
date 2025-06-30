# 🚀 GUIA DE DEPLOY PARA PRODUÇÃO

## Hub de Publicação de Conteúdo Frontend

---

## 📋 PRÉ-REQUISITOS

### Contas Necessárias

- [x] **Vercel Account** - Para hosting da aplicação
- [x] **Supabase Project** - Banco de dados e autenticação
- [x] **GitHub Repository** - Controle de versão
- [x] **Domínio Personalizado** (opcional)

### Variáveis de Ambiente Obrigatórias

```env
# Supabase (Obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://wayzhnpwphekjuznwqnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site Configuration
SITE_URL=https://seu-dominio.com
NEXT_PUBLIC_APP_NAME=Hub de Publicação

# Monetização (Opcional)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-...
NEXT_PUBLIC_GOOGLE_AD_MANAGER_ID=...

# APIs Externas (Opcional)
SEMRUSH_API_KEY=...
AHREFS_API_KEY=...

# WordPress Integration (Opcional)
WORDPRESS_API_URL=https://seu-site.com/wp-json/wp/v2
WORDPRESS_APP_PASSWORD_USER=...
WORDPRESS_APP_PASSWORD=...

# Autenticação
AUTH_SECRET=... # Gerar com: openssl rand -base64 32
```

---

## 🔧 CONFIGURAÇÃO DO SUPABASE

### 1. Row Level Security (RLS)

Execute no Editor SQL do Supabase:

```sql
-- Habilitar RLS em todas as tabelas principais
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE main_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de segurança
CREATE POLICY "Usuários podem ver seus próprios blogs"
ON blogs FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Usuários podem gerenciar suas keywords"
ON main_keywords FOR ALL USING (
  blog_id IN (SELECT id FROM blogs WHERE created_by = auth.uid())
);

CREATE POLICY "Usuários podem gerenciar seus posts"
ON content_posts FOR ALL USING (
  blog_id IN (SELECT id FROM blogs WHERE created_by = auth.uid())
);
```

### 2. Configurações de Rede

```
1. Acesse Supabase Dashboard > Settings > Database
2. Vá para "Network Restrictions"
3. Adicione os IPs da Vercel:
   - 76.76.19.0/24
   - 76.76.21.0/24
   - Ou configure para aceitar todos (0.0.0.0/0) temporariamente
```

### 3. Backup Automático

```
1. Settings > Database > Backups
2. Ativar "Point in Time Recovery"
3. Configurar retenção para 7-30 dias
```

---

## 🚀 DEPLOY NA VERCEL

### 1. Conectar Repositório

```bash
# Via CLI
npm install -g vercel
vercel login
vercel --prod

# Ou via Dashboard
1. Acesse vercel.com/dashboard
2. Clique "New Project"
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente
```

### 2. Configurações do Projeto

```json
{
  "name": "hub-publicacao",
  "framework": "nextjs",
  "buildCommand": "npm run build:production",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### 3. Variáveis de Ambiente na Vercel

```
1. Project Settings > Environment Variables
2. Adicionar todas as variáveis do arquivo .env.local
3. Configurar para Production, Preview e Development
4. Verificar se NEXT_PUBLIC_* estão corretas
```

### 4. Domínio Personalizado

```
1. Project Settings > Domains
2. Adicionar seu domínio
3. Configurar DNS:
   - Tipo: CNAME
   - Nome: www (ou @)
   - Valor: cname.vercel-dns.com
4. Aguardar propagação (até 48h)
```

---

## 🔒 CONFIGURAÇÕES DE SEGURANÇA

### 1. Headers de Segurança

Já configurados no `next.config.ts`:

- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ Referrer-Policy

### 2. Certificado SSL

```
- Vercel fornece SSL automático
- Redirecionamento HTTPS habilitado
- HSTS configurado para 2 anos
```

### 3. Monitoramento

```bash
# Logs da aplicação
vercel logs --follow

# Métricas de performance
vercel analytics

# Alertas de erro
Configurar Sentry ou similar
```

---

## 📊 OTIMIZAÇÕES DE PERFORMANCE

### 1. Core Web Vitals

- ✅ **LCP**: < 2.5s (otimizado com SSR)
- ✅ **FID**: < 100ms (bundle otimizado)
- ✅ **CLS**: < 0.1 (slots de anúncio fixos)

### 2. Caching

```typescript
// Headers de cache já configurados
Cache-Control: public, max-age=31536000, immutable
```

### 3. Bundle Analysis

```bash
# Analisar bundle
npm run build:analyze

# Verificar performance
npm run lighthouse
```

---

## 🧪 TESTES PRÉ-DEPLOY

### Checklist de Verificação

```bash
# 1. Build local
npm run build:production

# 2. Testes de tipo
npm run type-check

# 3. Linting
npm run lint

# 4. Teste de produção local
npm run start

# 5. Verificar todas as rotas
- ✅ / (Homepage)
- ✅ /dashboard
- ✅ /keywords
- ✅ /posts
- ✅ /analytics
- ✅ /monetization
- ✅ /settings
```

### 2. Testes de Funcionalidade

- [ ] Login/Logout funciona
- [ ] Dashboard carrega dados reais
- [ ] CRUD de keywords funciona
- [ ] CRUD de posts funciona
- [ ] Análise e relatórios funcionam
- [ ] Configurações salvam corretamente
- [ ] Real-time updates funcionam

### 3. Testes de Performance

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# Core Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
```

---

## 🔍 MONITORAMENTO PÓS-DEPLOY

### 1. Analytics

```javascript
// Google Analytics 4
gtag("config", "GA_MEASUREMENT_ID", {
  page_title: document.title,
  page_location: window.location.href,
});
```

### 2. Error Tracking

```bash
# Sentry (recomendado)
npm install @sentry/nextjs
```

### 3. Uptime Monitoring

- **UptimeRobot** (gratuito)
- **Pingdom** (pago)
- **Vercel Analytics** (integrado)

### 4. Performance Monitoring

```
1. Vercel Speed Insights
2. Google PageSpeed Insights
3. GTmetrix
4. WebPageTest
```

---

## 🚨 TROUBLESHOOTING

### Problemas Comuns

#### 1. Build Falha

```bash
# Verificar dependências
npm install

# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Variáveis de Ambiente

```bash
# Verificar se estão definidas
echo $NEXT_PUBLIC_SUPABASE_URL

# Verificar no runtime
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

#### 3. Erro de Conexão Supabase

```
1. Verificar URLs e keys
2. Verificar Network Restrictions
3. Verificar RLS policies
4. Verificar logs do Supabase
```

#### 4. CSP Errors

```
1. Verificar console do navegador
2. Ajustar nonces no middleware
3. Adicionar domínios necessários ao CSP
```

---

## 📈 OTIMIZAÇÕES FUTURAS

### 1. CDN e Caching

- Cloudflare para cache adicional
- Redis para session storage
- Edge functions para regiões específicas

### 2. Database Optimization

- Índices para queries frequentes
- Connection pooling
- Read replicas para analytics

### 3. Monitoring Avançado

- APM (Application Performance Monitoring)
- Real User Monitoring (RUM)
- Custom metrics e alertas

---

## ✅ CHECKLIST FINAL

### Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local bem-sucedido
- [ ] Testes passando
- [ ] RLS configurado no Supabase
- [ ] Domínio configurado (se aplicável)

### Pós-Deploy

- [ ] SSL ativo e funcionando
- [ ] Todas as rotas acessíveis
- [ ] Funcionalidades principais testadas
- [ ] Monitoramento configurado
- [ ] Backup automático ativo
- [ ] Performance dentro dos targets

---

**🎉 DEPLOY COMPLETO!**

Sua aplicação está agora rodando em produção com:

- ✅ Segurança enterprise-level
- ✅ Performance otimizada
- ✅ Monitoramento ativo
- ✅ Backup automático
- ✅ SSL/HTTPS configurado

---

_Última atualização: Dezembro 2024_
