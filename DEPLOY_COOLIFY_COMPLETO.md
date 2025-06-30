# 🚀 Deploy Completo no Coolify - Front-Os-Parça

## 📋 Visão Geral

Este guia contém **TUDO** que você precisa para fazer deploy da aplicação no Coolify. Todos os arquivos estão incluídos e o processo é automatizado.

### 💰 Custos Finais

- **VPS Hetzner**: €4.90/mês (2vCPU, 4GB RAM, 40GB SSD)
- **Coolify Cloud**: $5/mês (ou gratuito self-hosted)
- **Domínio**: $10-15/ano (opcional)
- **Total mensal**: ~$15

## 📁 Arquivos Criados

Os seguintes arquivos foram criados/atualizados no seu projeto:

### ✅ Arquivos Obrigatórios

- `Dockerfile` - Container otimizado para Next.js
- `.dockerignore` - Exclusões para build
- `next.config.js` - Atualizado com `output: 'standalone'`
- `.env.local.example` - Template de variáveis

### ✅ Arquivos de Automação

- `scripts/deploy.sh` - Script de deploy Linux/Mac
- `scripts/deploy.ps1` - Script de deploy Windows
- `docker-compose.yml` - Para testes locais
- `coolify-deployment.md` - Guia simplificado

## 🚀 Processo Completo de Deploy

### Etapa 1: Verificar Arquivos (2 min)

1. **Confirme que os arquivos foram criados:**

   ```bash
   ls -la Dockerfile .dockerignore
   ```

2. **Verifique o next.config.js:**
   - Deve conter `output: 'standalone'`
   - Se não tiver, adicione esta linha no início do objeto de configuração

### Etapa 2: Configurar VPS (10 min)

#### 2.1 Comprar VPS na Hetzner

1. Acesse [Hetzner Cloud](https://www.hetzner.com/cloud)
2. Crie conta e verifique (€20 de crédito inicial)
3. Crie servidor:
   - **Localização**: Alemanha ou mais próximo do seu público
   - **Imagem**: Ubuntu 22.04
   - **Tipo**: CPX21 (2 vCPU, 4GB RAM) - €4.90/mês
   - **SSH Key**: Gere uma nova ou use existente

#### 2.2 Instalar Coolify

```bash
# Conectar ao servidor
ssh root@SEU_IP_VPS

# Instalar Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

# Aguardar instalação (5-10 minutos)
```

#### 2.3 Configurar Domínio (Opcional)

Se você tem um domínio:

1. Configure DNS A records:
   - `@` → IP_DA_VPS
   - `*` → IP_DA_VPS (para subdomínios automáticos)

### Etapa 3: Deploy no Coolify (10 min)

#### 3.1 Acessar Coolify

1. Abra: `http://SEU_IP_VPS:8000`
2. Crie conta admin
3. Complete o setup inicial

#### 3.2 Conectar GitHub

1. Vá em "Sources" → "Add"
2. Registre GitHub App:
   - Nome: "Front-Os-Parca Deploy"
   - Instale nos repositórios necessários

#### 3.3 Criar Projeto

1. "Projects" → "Add"
2. Nome: "Front-Os-Parca"
3. Ambiente: "Production"

#### 3.4 Adicionar Aplicação

1. "Add Resource" → "Private Repository (with Github App)"
2. Selecione seu repositório
3. Branch: `main`
4. **Build Pack**: `Dockerfile` (IMPORTANTE!)

#### 3.5 Configurar Build

- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`

### Etapa 4: Variáveis de Ambiente (5 min)

Na aba "Environment Variables" do Coolify, adicione:

```bash
# OBRIGATÓRIAS - CONFIGURE ESTAS
NODE_ENV=production
NEXTAUTH_SECRET=gere-uma-chave-de-32-caracteres-aqui
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico-supabase

# OPCIONAIS - ADICIONE SE NECESSÁRIO
DATABASE_URL=postgresql://usuario:senha@host:5432/database
WORDPRESS_API_URL=https://seu-wordpress.com/wp-json/wp/v2
WORDPRESS_USERNAME=admin
WORDPRESS_PASSWORD=sua-senha-wordpress
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook

# ANALYTICS (OPCIONAL)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=sua-chave-posthog
```

### Etapa 5: Deploy e Configuração (5 min)

1. **Primeiro Deploy**:

   - Clique em "Deploy"
   - Aguarde 5-10 minutos
   - Acompanhe logs em tempo real

2. **Configurar Domínio** (se tiver):

   - Vá em "Domains"
   - Adicione: `seudominio.com`
   - Habilite SSL automático

3. **Atualizar URLs**:

   ```bash
   NEXTAUTH_URL=https://seudominio.com
   NEXT_PUBLIC_URL=https://seudominio.com
   ```

4. **Redeploy**:
   - Clique em "Redeploy"

## 🤖 Deploy Automatizado

### Para Linux/Mac:

```bash
# Tornar executável
chmod +x scripts/deploy.sh

# Executar deploy
./scripts/deploy.sh production
```

### Para Windows:

```powershell
# Executar deploy
.\scripts\deploy.ps1 production
```

O script automaticamente:

- ✅ Verifica arquivos necessários
- ✅ Gera NEXTAUTH_SECRET se necessário
- ✅ Faz commit e push das mudanças
- ✅ Testa build local (se Docker disponível)
- ✅ Fornece instruções claras

## 🔧 Configurações Avançadas

### SSL/HTTPS Automático

- Coolify configura automaticamente Let's Encrypt
- Renovação automática dos certificados
- Redirect HTTP → HTTPS

### Backup Automático

1. No Coolify: "Backups"
2. Frequência: Diária
3. Retenção: 7 dias
4. Inclui: Aplicação + dados

### CI/CD Automático

1. No Coolify: "Webhooks"
2. Copie URL do webhook
3. No GitHub: Settings → Webhooks
4. Cole URL e configure para "push" events

### Monitoramento

- CPU/RAM/Disk usage em tempo real
- Logs da aplicação
- Health checks automáticos
- Alertas por email (configurável)

## 🔒 Segurança

### Firewall Básico (VPS)

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8000  # Coolify
sudo ufw enable
```

### Headers de Segurança

Já configurados no `next.config.js`:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🚨 Troubleshooting

### Build Falha

```bash
# Verificar logs no Coolify
# Problemas comuns:
1. next.config.js sem output: 'standalone'
2. Variáveis de ambiente faltando
3. Dependências não instaladas
```

### App Não Inicia

```bash
# Verificar:
1. Porta 3000 exposta no Dockerfile
2. Comando start correto
3. Variáveis obrigatórias definidas
```

### Erro 500

```bash
# Verificar:
1. NEXTAUTH_SECRET definido
2. URLs do Supabase corretas
3. Conexão com banco de dados
```

### Gerar NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32))

# Online
https://generate-secret.vercel.app/32
```

## 📊 Verificação Final

### ✅ Checklist Completo

- [ ] **Arquivos criados**: Dockerfile, .dockerignore, scripts
- [ ] **next.config.js**: Contém `output: 'standalone'`
- [ ] **VPS configurado**: Hetzner + Coolify instalado
- [ ] **GitHub conectado**: App configurado no Coolify
- [ ] **Projeto criado**: Front-Os-Parca no Coolify
- [ ] **Build configurado**: Dockerfile selecionado
- [ ] **Variáveis definidas**: Todas as obrigatórias
- [ ] **Deploy realizado**: Build completou sem erros
- [ ] **App funcionando**: Acessível via URL
- [ ] **SSL ativo**: HTTPS funcionando
- [ ] **Domínio configurado**: Se aplicável
- [ ] **Backup ativo**: Configurado no Coolify
- [ ] **Webhook configurado**: Deploy automático

### 🎯 URLs de Acesso

Após o deploy bem-sucedido:

- **Coolify Dashboard**: `http://SEU_IP_VPS:8000`
- **Aplicação**: `https://seudominio.com` ou URL fornecida pelo Coolify
- **Logs**: Disponíveis no dashboard do Coolify
- **Métricas**: Monitoramento em tempo real

## 🎉 Resultado Final

Parabéns! Você agora tem:

- ✅ **Aplicação em produção** rodando 24/7
- ✅ **HTTPS automático** com certificados válidos
- ✅ **Deploy automático** via Git push
- ✅ **Backup diário** configurado
- ✅ **Monitoramento completo** em tempo real
- ✅ **Escalabilidade** conforme necessário
- ✅ **Custo previsível** sem surpresas

### Próximos Passos Recomendados

1. **Configure CDN** (Cloudflare) para performance global
2. **Implemente testes** automatizados
3. **Configure staging** environment
4. **Monitore performance** com ferramentas externas
5. **Documente APIs** para equipe

## 📞 Suporte e Recursos

### Documentação Oficial

- [Coolify Docs](https://coolify.io/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Comunidade

- [Coolify Discord](https://discord.gg/coolify)
- [GitHub Issues](https://github.com/coollabsio/coolify/issues)

### Contatos de Emergência

- **Hetzner Support**: Para problemas de VPS
- **Coolify Community**: Para problemas de deploy
- **Supabase Support**: Para problemas de banco

---

**🎯 Tempo total de setup**: 30-45 minutos
**💰 Custo mensal total**: ~$15
**⚡ Performance**: Excelente com CDN
**🔒 Segurança**: Produção-ready
**📈 Escalabilidade**: Horizontal e vertical

**Deploy realizado com sucesso! 🚀**
