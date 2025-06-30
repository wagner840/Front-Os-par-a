# Script de Deploy Automatizado para Coolify (PowerShell)
# Uso: .\scripts\deploy.ps1 [environment]

param(
    [string]$Environment = "production"
)

# Cores para output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Verificar se estamos na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Error "Este script deve ser executado na raiz do projeto"
    exit 1
}

Write-Info "Fazendo deploy para ambiente: $Environment"

# Verificar se os arquivos necessários existem
Write-Info "Verificando arquivos necessários..."

if (-not (Test-Path "Dockerfile")) {
    Write-Error "Dockerfile não encontrado."
    Write-Info "Crie o Dockerfile com base no template fornecido"
    exit 1
}

if (-not (Test-Path ".dockerignore")) {
    Write-Warning ".dockerignore não encontrado. Criando um básico..."
    @"
node_modules
.next
.env*
.git
.vscode
*.log
README.md
docs/
"@ | Out-File -FilePath ".dockerignore" -Encoding utf8
}

# Verificar se next.config.js tem output: standalone
$nextConfigContent = Get-Content "next.config.js" -Raw
if ($nextConfigContent -notmatch "output.*standalone") {
    Write-Error "next.config.js deve conter 'output: `"standalone`"' para funcionar com Coolify"
    Write-Info "Adicione esta linha no seu next.config.js:"
    Write-Host "  output: 'standalone'," -ForegroundColor White
    exit 1
}

Write-Success "Todos os arquivos necessários encontrados"

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Há mudanças não commitadas. Commitando automaticamente..."
    git add .
    git commit -m "chore: deploy to $Environment - $(Get-Date)"
}

# Fazer push para o repositório
Write-Info "Fazendo push para o repositório..."
$currentBranch = git branch --show-current
git push origin $currentBranch

Write-Success "Push realizado com sucesso"

# Verificar se as variáveis de ambiente estão configuradas
Write-Info "Verificando variáveis de ambiente..."

$requiredVars = @(
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

$missingVars = @()

foreach ($var in $requiredVars) {
    $envValue = [Environment]::GetEnvironmentVariable($var)
    $localEnvExists = Test-Path ".env.local"
    
    if (-not $envValue -and (-not $localEnvExists -or -not (Select-String -Path ".env.local" -Pattern "^$var=" -Quiet))) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Warning "As seguintes variáveis de ambiente não foram encontradas:"
    foreach ($var in $missingVars) {
        Write-Host "  - $var" -ForegroundColor Yellow
    }
    Write-Info "Certifique-se de configurá-las no Coolify antes do deploy"
}

# Gerar NEXTAUTH_SECRET se não existir
$nextAuthExists = [Environment]::GetEnvironmentVariable("NEXTAUTH_SECRET")
$nextAuthInFile = $false
if (Test-Path ".env.local") {
    $nextAuthInFile = Select-String -Path ".env.local" -Pattern "^NEXTAUTH_SECRET=" -Quiet
}

if (-not $nextAuthExists -and -not $nextAuthInFile) {
    Write-Info "Gerando NEXTAUTH_SECRET..."
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    Write-Host "NEXTAUTH_SECRET gerado: $secret" -ForegroundColor Cyan
    Write-Warning "Adicione esta variável no Coolify!"
}

# Verificar se Docker está disponível (para teste local)
if (Get-Command docker -ErrorAction SilentlyContinue) {
    try {
        docker info | Out-Null
        Write-Info "Testando build local..."
        docker build -t front-os-parca-test . | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Build local bem-sucedido"
            docker rmi front-os-parca-test | Out-Null
        } else {
            Write-Error "Build local falhou. Verifique o Dockerfile"
            exit 1
        }
    } catch {
        Write-Warning "Docker não está rodando ou não está disponível"
    }
}

# Instruções para o usuário
Write-Host ""
Write-Success "Deploy preparado com sucesso!"
Write-Host ""
Write-Info "Próximos passos no Coolify:"
Write-Host "  1. Acesse seu painel do Coolify"
Write-Host "  2. Vá para o projeto 'Front-Os-Parca'"
Write-Host "  3. Clique em 'Deploy' ou aguarde o deploy automático"
Write-Host "  4. Verifique os logs de build"
Write-Host "  5. Teste a aplicação no domínio configurado"
Write-Host ""

if ($missingVars.Count -gt 0) {
    Write-Warning "Não esqueça de configurar as variáveis de ambiente no Coolify!"
}

Write-Info "Deploy script concluído para ambiente: $Environment" 