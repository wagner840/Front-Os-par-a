# 🚨 Troubleshooting - Problemas de Deploy

Este documento resolve os problemas comuns que você está enfrentando após o deploy.

## 🎯 Problemas Identificados

1. **❌ Comando de start incorreto** - `next start` não funciona com `output: standalone`
2. **❌ Problemas de login** - Provavelmente variáveis de ambiente faltando
3. **❌ WordPress não conecta** - Configurações não carregadas

## 🔧 Soluções Rápidas

### 1. **CORRIGIR COMANDO DE START (URGENTE)**

No **Coolify**, altere o comando de start:

**❌ Comando atual (incorreto):**

```bash
npm start
```

**✅ Comando correto:**

```bash
node .next/standalone/server.js
```

**Onde alterar no Coolify:**

1. Vá para seu projeto no Coolify
2. **Settings → Build**
3. **Build & Deploy → Start Command**
4. Altere para: `node .next/standalone/server.js`
5. **Save & Redeploy**

### 2. **CONFIGURAR VARIÁVEIS DE AMBIENTE**

No Coolify, adicione essas variáveis obrigatórias:

**📊 Supabase (OBRIGATÓRIAS):**

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

**🌐 WordPress Einsof7:**

```env
EINSOF7_WORDPRESS_URL=https://einsof7.com
EINSOF7_WORDPRESS_USERNAME=seu_usuario_admin
EINSOF7_WORDPRESS_PASSWORD=sua_app_password
```

**🌐 WordPress Opetmil:**

```env
OPETMIL_WORDPRESS_URL=https://opetmil.com
OPETMIL_WORDPRESS_USERNAME=seu_usuario_admin
OPETMIL_WORDPRESS_PASSWORD=sua_app_password
```

**⚙️ Outras importantes:**

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXTAUTH_SECRET=sua_chave_secreta_longa_e_aleatoria
NEXTAUTH_URL=https://seu-dominio.com
```

## 🔍 Debug Rápido

Após fazer as alterações, execute este comando no terminal do Coolify para verificar:

```bash
npm run debug:env
```

Isso mostrará quais variáveis estão configuradas e quais estão faltando.

## 📋 Checklist de Deploy

### Passo 1: Corrigir Comando Start

- [ ] Alterar start command para `node .next/standalone/server.js`
- [ ] Fazer redeploy

### Passo 2: Configurar Variáveis

- [ ] Adicionar variáveis do Supabase
- [ ] Adicionar variáveis do WordPress (Einsof7)
- [ ] Adicionar variáveis do WordPress (Opetmil)
- [ ] Adicionar NEXTAUTH_SECRET e NEXTAUTH_URL

### Passo 3: Testar

- [ ] Fazer deploy/restart
- [ ] Executar `npm run debug:env`
- [ ] Tentar fazer login
- [ ] Testar conexão WordPress

## 🚀 Como Obter as Variáveis

### **Supabase:**

1. Vá para [supabase.com](https://supabase.com)
2. Seu projeto → **Settings → API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### **WordPress App Password:**

1. WordPress Admin → **Usuários → Seu Perfil**
2. Role até **Application Passwords**
3. Nome: "Content Hub Integration"
4. **Add New Application Password**
5. Copie a senha gerada (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### **NEXTAUTH_SECRET:**

Gere uma chave aleatória:

```bash
openssl rand -base64 32
```

## 🔥 Solução de Emergência

Se nada funcionar, siga esta sequência:

1. **No Coolify:**

   ```bash
   # 1. Alterar start command
   node .next/standalone/server.js

   # 2. Configurar apenas essas variáveis essenciais
   NEXT_PUBLIC_SUPABASE_URL=sua_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
   NODE_ENV=production
   PORT=3000
   NEXTAUTH_SECRET=sua_chave_secreta
   NEXTAUTH_URL=https://seu-dominio.com
   ```

2. **Redeploy da aplicação**

3. **Testar login básico**

4. **Adicionar variáveis WordPress depois**

## 🐛 Logs Úteis

Para debug, verifique estes logs no Coolify:

```bash
# Ver logs da aplicação
docker logs nome_do_container

# Ver variáveis de ambiente
docker exec nome_do_container env | grep -E "(SUPABASE|WORDPRESS|NEXTAUTH)"

# Testar se o servidor está rodando
docker exec nome_do_container curl http://localhost:3000
```

## ⚡ Comandos de Debug

Execute no terminal do Coolify:

```bash
# Verificar se o arquivo standalone existe
ls -la .next/standalone/

# Testar o servidor diretamente
node .next/standalone/server.js

# Verificar variáveis
npm run debug:env
```

## 📞 Se Ainda Não Funcionar

1. **Verifique se o build foi bem-sucedido**
2. **Confirme que o arquivo `.next/standalone/server.js` existe**
3. **Teste cada variável individualmente**
4. **Verifique se não há caracteres especiais nas senhas**
5. **Confirme que os domínios WordPress estão acessíveis**

## 🎯 Resultado Esperado

Após seguir todos os passos:

- ✅ Aplicação inicia sem warnings
- ✅ Login funciona
- ✅ WordPress conecta
- ✅ Debug mostra todas as variáveis configuradas

---

**💡 Dica:** Sempre que alterar variáveis de ambiente no Coolify, é necessário fazer um **redeploy completo**, não apenas restart!
