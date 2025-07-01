# 🔗 Configuração Múltipla WordPress

## 📋 Visão Geral

O sistema suporta múltiplos blogs WordPress com configuração flexível:

- **Variáveis de ambiente** (prioridade alta) - Para deploy no Coolify
- **Configurações no banco** (prioridade baixa) - Para desenvolvimento local

## 🚀 Deploy no Coolify

### Variáveis de Ambiente Obrigatórias

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

### Como Obter App Password no WordPress

1. Acesse **WordPress Admin → Usuários → Perfil**
2. Role até **Application Passwords**
3. Digite um nome (ex: "Content Hub Integration")
4. Clique em **Add New Application Password**
5. Copie a senha gerada (formato: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Use essa senha na variável `*_WORDPRESS_PASSWORD`

## 🔧 Como Usar no Código

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

## ✅ Checklist de Deploy

- [ ] Configurar variáveis de ambiente no Coolify
- [ ] Testar App Passwords no WordPress
- [ ] Verificar URLs acessíveis
- [ ] Fazer deploy da aplicação
- [ ] Testar conexão de cada blog
