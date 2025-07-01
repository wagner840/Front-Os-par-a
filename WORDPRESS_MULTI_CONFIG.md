# 🔗 Configuração Múltipla WordPress

Este documento explica como configurar múltiplos blogs WordPress no sistema, tanto para desenvolvimento quanto para deploy no Coolify.

## 📋 Visão Geral

O sistema suporta múltiplos blogs WordPress com configuração flexível:

- **Variáveis de ambiente** (prioridade alta) - Para deploy no Coolify
- **Configurações no banco** (prioridade baixa) - Para desenvolvimento local

## 🏗️ Estrutura dos Blogs

### Blogs Configurados:

- **Einsof7**: `einsof7.com` (ID: `718d1bf5-ba1a-4c86-8fa4-c13599eb4952`)
- **Opetmil**: `opetmil.com` (ID: `25228f83-0b0d-47c7-926f-1ab6d7255f7b`)

## 🚀 Deploy no Coolify

### 1. Variáveis de Ambiente Obrigatórias

No Coolify, configure essas variáveis:

```env
# === EINSOF7 ===
EINSOF7_WORDPRESS_URL=https://einsof7.com
EINSOF7_WORDPRESS_USERNAME=seu_usuario_admin
EINSOF7_WORDPRESS_PASSWORD=sua_app_password

# === OPETMIL ===
OPETMIL_WORDPRESS_URL=https://opetmil.com
OPETMIL_WORDPRESS_USERNAME=seu_usuario_admin
OPETMIL_WORDPRESS_PASSWORD=sua_app_password
```

### 2. Variáveis Opcionais (com valores padrão)

```env
# Configurações avançadas Einsof7
EINSOF7_WORDPRESS_SYNC_ENABLED=true
EINSOF7_WORDPRESS_SYNC_INTERVAL=60
EINSOF7_WORDPRESS_SYNC_CATEGORIES=true
EINSOF7_WORDPRESS_SYNC_TAGS=true
EINSOF7_WORDPRESS_SYNC_MEDIA=true
EINSOF7_WORDPRESS_SYNC_COMMENTS=false
EINSOF7_WORDPRESS_BACKUP_ENABLED=false
EINSOF7_WORDPRESS_BACKUP_FREQUENCY=daily

# Configurações avançadas Opetmil
OPETMIL_WORDPRESS_SYNC_ENABLED=true
OPETMIL_WORDPRESS_SYNC_INTERVAL=60
OPETMIL_WORDPRESS_SYNC_CATEGORIES=true
OPETMIL_WORDPRESS_SYNC_TAGS=true
OPETMIL_WORDPRESS_SYNC_MEDIA=true
OPETMIL_WORDPRESS_SYNC_COMMENTS=false
OPETMIL_WORDPRESS_BACKUP_ENABLED=false
OPETMIL_WORDPRESS_BACKUP_FREQUENCY=daily
```

### 3. Como Obter App Password no WordPress

1. Acesse **WordPress Admin → Usuários → Perfil**
2. Role até **Application Passwords**
3. Digite um nome (ex: "Content Hub Integration")
4. Clique em **Add New Application Password**
5. Copie a senha gerada (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Use essa senha na variável `*_WORDPRESS_PASSWORD`

## 💻 Desenvolvimento Local

### 1. Configuração via Interface (Recomendado)

Para desenvolvimento, use a interface web:

- Vá em **Configurações → Integrações → WordPress**
- Configure cada blog individualmente
- As configurações ficam salvas no banco Supabase

### 2. Configuração via .env (Opcional)

Se preferir, crie um `.env.local`:

```env
# Copie as variáveis do .env.example
EINSOF7_WORDPRESS_URL=http://localhost:8080
EINSOF7_WORDPRESS_USERNAME=admin
EINSOF7_WORDPRESS_PASSWORD=sua_app_password
```

## 🔧 Como Usar no Código

### 1. Hook Principal (Novo)

```typescript
import { useWordPressConfigMulti } from "@/lib/hooks/useWordPressMulti";

function MyComponent() {
  const { data: config, isLoading } = useWordPressConfigMulti(selectedBlogId);

  if (config?.source === "environment") {
    // Configuração vem das variáveis de ambiente (não pode editar)
  } else if (config?.source === "database") {
    // Configuração vem do banco (pode editar)
  }
}
```

### 2. Hook de Status

```typescript
import { useWordPressConfigStatus } from "@/lib/hooks/useWordPressMulti";

function StatusComponent() {
  const { data: status } = useWordPressConfigStatus();

  console.log(`${status.configured}/${status.total} blogs configurados`);
  console.log(`${status.fromEnvironment} via ambiente`);
  console.log(`${status.fromDatabase} via banco`);
}
```

### 3. Hook de Teste de Conexão

```typescript
import { useTestWordPressConnectionMulti } from "@/lib/hooks/useWordPressMulti";

function TestConnection() {
  const testConnection = useTestWordPressConnectionMulti();

  const handleTest = (blogId: string) => {
    testConnection.mutate({ blogId });
  };
}
```

## 🏃‍♂️ Fluxo de Priorização

1. **Primeiro**: Busca nas variáveis de ambiente (`EINSOF7_*`, `OPETMIL_*`)
2. **Segundo**: Busca no banco Supabase (tabela `blogs.settings.wordpress`)
3. **Terceiro**: Retorna `null` (não configurado)

## 🔒 Segurança

### Variáveis de Ambiente (Produção)

- ✅ **Vantagens**: Seguras, não expostas no banco
- ✅ **Immutáveis**: Não podem ser alteradas via interface
- ⚠️ **Observação**: Requerem restart da aplicação para alterar

### Configurações no Banco (Desenvolvimento)

- ✅ **Vantagens**: Fáceis de alterar via interface
- ⚠️ **Observação**: Ficam visíveis no banco de dados
- 🔧 **Recomendação**: Use apenas para desenvolvimento

## 🚨 Troubleshooting

### Problema: "WordPress config not found"

**Causa**: Nenhuma configuração encontrada para o blog

**Solução**:

1. Verifique as variáveis de ambiente no Coolify
2. Ou configure via interface em desenvolvimento
3. Confirme se o blog ID está correto

### Problema: "Cannot edit environment config"

**Causa**: Tentativa de editar configuração que vem de variáveis de ambiente

**Solução**:

- Em produção: Altere as variáveis no Coolify e restart
- Em desenvolvimento: Remova as variáveis do `.env.local`

### Problema: Conexão WordPress falha

**Verificações**:

1. URL está acessível
2. App Password está correta (sem espaços)
3. Usuário tem permissões administrativas
4. WordPress está com API REST habilitada

## 📊 Debug

### Console Logs

Durante o desenvolvimento, os logs mostrarão:

```
🔍 WordPress Configurations Debug:
📝 EINSOF7 (718d1bf5-ba1a-4c86-8fa4-c13599eb4952):
  - Environment Config: ✅ Found
  - URL: https://einsof7.com
  - Username: admin
  - Sync Enabled: true

📝 OPETMIL (25228f83-0b0d-47c7-926f-1ab6d7255f7b):
  - Environment Config: ❌ Not found
```

### Runtime Logs

```
📡 Using environment config for blog 718d1bf5-ba1a-4c86-8fa4-c13599eb4952
💾 Using database config for blog 25228f83-0b0d-47c7-926f-1ab6d7255f7b
```

## 🔄 Migração

### De Configuração Única para Múltipla

1. **Backup**: Exporte configurações atuais do banco
2. **Migre**: Configure variáveis de ambiente no Coolify
3. **Teste**: Verifique cada blog individualmente
4. **Deploy**: Faça deploy com novas configurações

### Adicionar Novo Blog

1. **Código**: Adicione ID em `src/lib/wordpress/config.ts`
2. **Variáveis**: Configure `NOVOBLOG_*` no Coolify
3. **Teste**: Use hook de teste de conexão

## 📝 Exemplo Completo

```typescript
// src/components/WordPressManager.tsx
import {
  useWordPressConfigStatus,
  useBlogInfo,
} from "@/lib/hooks/useWordPressMulti";

export function WordPressManager() {
  const { data: status } = useWordPressConfigStatus();

  return (
    <div>
      <h2>
        WordPress Status ({status?.configured}/{status?.total})
      </h2>

      {status?.blogs.map((blog) => (
        <div key={blog.blogId} className="border p-4 rounded">
          <h3>{blog.name}</h3>
          <p>
            Status: {blog.hasConfig ? "✅ Configurado" : "❌ Não configurado"}
          </p>
          <p>Fonte: {blog.source}</p>
          <p>Editável: {blog.canEdit ? "Sim" : "Não (ambiente)"}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist de Deploy

- [ ] Configurar variáveis de ambiente no Coolify
- [ ] Testar App Passwords no WordPress
- [ ] Verificar URLs acessíveis
- [ ] Fazer deploy da aplicação
- [ ] Testar conexão de cada blog
- [ ] Verificar logs de debug
- [ ] Testar sincronização de posts
