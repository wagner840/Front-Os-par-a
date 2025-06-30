#!/bin/bash

# Script de Deploy Automatizado para Coolify
# Uso: ./scripts/deploy.sh [environment]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos na raiz do projeto
if [ ! -f "package.json" ]; then
    log_error "Este script deve ser executado na raiz do projeto"
    exit 1
fi

# Definir ambiente (padrão: production)
ENVIRONMENT=${1:-production}
log_info "Fazendo deploy para ambiente: $ENVIRONMENT"

# Verificar se os arquivos necessários existem
log_info "Verificando arquivos necessários..."

if [ ! -f "Dockerfile" ]; then
    log_error "Dockerfile não encontrado. Execute primeiro: cp Dockerfile.example Dockerfile"
    exit 1
fi

if [ ! -f ".dockerignore" ]; then
    log_warning ".dockerignore não encontrado. Criando um básico..."
    cat > .dockerignore << EOF
node_modules
.next
.env*
.git
.vscode
*.log
README.md
docs/
EOF
fi

# Verificar se next.config.js tem output: standalone
if ! grep -q "output.*standalone" next.config.js; then
    log_error "next.config.js deve conter 'output: \"standalone\"' para funcionar com Coolify"
    log_info "Adicione esta linha no seu next.config.js:"
    echo "  output: 'standalone',"
    exit 1
fi

log_success "Todos os arquivos necessários encontrados"

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Há mudanças não commitadas. Commitando automaticamente..."
    git add .
    git commit -m "chore: deploy to $ENVIRONMENT - $(date)"
fi

# Fazer push para o repositório
log_info "Fazendo push para o repositório..."
git push origin $(git branch --show-current)

log_success "Push realizado com sucesso"

# Verificar se as variáveis de ambiente estão configuradas
log_info "Verificando variáveis de ambiente..."

ENV_VARS=(
    "NEXTAUTH_SECRET"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

MISSING_VARS=()

for var in "${ENV_VARS[@]}"; do
    if [ -z "${!var}" ] && [ ! -f ".env.local" ] || ! grep -q "^$var=" .env.local 2>/dev/null; then
        MISSING_VARS+=($var)
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log_warning "As seguintes variáveis de ambiente não foram encontradas:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    log_info "Certifique-se de configurá-las no Coolify antes do deploy"
fi

# Gerar NEXTAUTH_SECRET se não existir
if [ -z "$NEXTAUTH_SECRET" ] && ! grep -q "^NEXTAUTH_SECRET=" .env.local 2>/dev/null; then
    log_info "Gerando NEXTAUTH_SECRET..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET gerado: $SECRET"
    log_warning "Adicione esta variável no Coolify!"
fi

# Verificar se Docker está rodando (para teste local)
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        log_info "Testando build local..."
        if docker build -t front-os-parca-test . &> /dev/null; then
            log_success "Build local bem-sucedido"
            docker rmi front-os-parca-test &> /dev/null || true
        else
            log_error "Build local falhou. Verifique o Dockerfile"
            exit 1
        fi
    fi
fi

# Instruções para o usuário
echo ""
log_success "Deploy preparado com sucesso!"
echo ""
log_info "Próximos passos no Coolify:"
echo "  1. Acesse seu painel do Coolify"
echo "  2. Vá para o projeto 'Front-Os-Parca'"
echo "  3. Clique em 'Deploy' ou aguarde o deploy automático"
echo "  4. Verifique os logs de build"
echo "  5. Teste a aplicação no domínio configurado"
echo ""

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log_warning "Não esqueça de configurar as variáveis de ambiente no Coolify!"
fi

log_info "Deploy script concluído para ambiente: $ENVIRONMENT" 