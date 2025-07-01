#!/bin/bash

echo "🚀 Iniciando aplicação em modo de produção..."

# Verificar se estamos no modo standalone
if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ Erro: Arquivo .next/standalone/server.js não encontrado!"
  echo "💡 Certifique-se de que o build foi feito com output: 'standalone'"
  exit 1
fi

# Verificar variáveis obrigatórias
echo "🔍 Verificando variáveis de ambiente..."

missing_vars=()

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  missing_vars+=("NEXT_PUBLIC_SUPABASE_URL")
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  missing_vars+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
fi

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Variáveis obrigatórias faltando:"
  for var in "${missing_vars[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "💡 Configure essas variáveis no Coolify e faça redeploy"
  exit 1
fi

echo "✅ Variáveis obrigatórias configuradas"

# Verificar configurações WordPress
wordpress_configured=false

if [ -n "$EINSOF7_WORDPRESS_URL" ] && [ -n "$EINSOF7_WORDPRESS_USERNAME" ] && [ -n "$EINSOF7_WORDPRESS_PASSWORD" ]; then
  echo "✅ WordPress Einsof7 configurado"
  wordpress_configured=true
fi

if [ -n "$OPETMIL_WORDPRESS_URL" ] && [ -n "$OPETMIL_WORDPRESS_USERNAME" ] && [ -n "$OPETMIL_WORDPRESS_PASSWORD" ]; then
  echo "✅ WordPress Opetmil configurado"
  wordpress_configured=true
fi

if [ "$wordpress_configured" = false ]; then
  echo "⚠️  Nenhum WordPress configurado via variáveis de ambiente"
  echo "💡 Os blogs serão configurados via interface web"
fi

# Definir variáveis padrão se não existirem
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "🌐 Servidor será iniciado em: $HOSTNAME:$PORT"
echo "🔧 Ambiente: $NODE_ENV"

# Iniciar o servidor
echo "🚀 Iniciando servidor standalone..."
exec node .next/standalone/server.js 