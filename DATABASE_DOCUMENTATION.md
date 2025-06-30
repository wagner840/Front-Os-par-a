# 📚 DOCUMENTAÇÃO TÉCNICA DO BANCO DE DADOS

## Sistema de Gestão de Conteúdo e SEO

---

## 📋 **ÍNDICE**

1. [Visão Geral](#visão-geral)
2. [Esquema de Tabelas](#esquema-de-tabelas)
3. [Relacionamentos](#relacionamentos)
4. [APIs e Funções](#apis-e-funções)
5. [Sistema de Embeddings](#sistema-de-embeddings)
6. [Segurança e RLS](#segurança-e-rls)
7. [Triggers e Automações](#triggers-e-automações)
8. [Consultas Úteis](#consultas-úteis)
9. [Casos de Uso Frontend](#casos-de-uso-frontend)
10. [Extensões e Configurações](#extensões-e-configurações)

---

## 🎯 **VISÃO GERAL**

### Propósito

Sistema completo para gestão de múltiplos blogs com foco em SEO, análise de palavras-chave e criação de conteúdo baseada em IA.

### Tecnologias Core

- **PostgreSQL 17.4.1** com extensões avançadas
- **Supabase** (autenticação, RLS, real-time)
- **pgvector** (busca semântica com embeddings)
- **OpenAI Integration** (processamento de conteúdo)

### Dados Atuais

- **2 blogs** ativos
- **22 keywords principais** → **593 variações**
- **22 posts** de conteúdo
- **27 clusters** de keywords
- **1 autor** registrado

---

## 🗄️ **ESQUEMA DE TABELAS**

### **1. NÚCLEO CENTRAL**

#### `blogs` - Tabela Central

```sql
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    niche TEXT,
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos Principais:**

- `settings`: JSON com configurações específicas do blog
- `niche`: Nicho/categoria do blog para análises
- `domain`: URL do blog

#### `authors` - Autores

```sql
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### **2. SISTEMA DE KEYWORDS**

#### `main_keywords` - Keywords Principais

```sql
CREATE TABLE main_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    keyword VARCHAR(500) NOT NULL,
    msv INTEGER, -- Monthly Search Volume
    kw_difficulty INTEGER, -- Keyword Difficulty (0-100)
    cpc NUMERIC, -- Cost Per Click
    competition VARCHAR(50), -- LOW, MEDIUM, HIGH
    search_intent VARCHAR(50), -- informational, transactional, etc.
    is_used BOOLEAN DEFAULT false,
    location VARCHAR DEFAULT 'Brazil',
    language VARCHAR DEFAULT 'Portuguese',
    "Search_limit" SMALLINT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos Especiais:**

- `is_used`: Marcado automaticamente quando vinculado a post
- `Search_limit`: Limite para busca de variações

#### `keyword_variations` - Variações de Keywords

```sql
CREATE TABLE keyword_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_keyword_id UUID NOT NULL REFERENCES main_keywords(id),
    keyword TEXT NOT NULL,
    variation_type VARCHAR(50), -- synonym, long-tail, question, etc.
    msv INTEGER,
    kw_difficulty INTEGER,
    cpc NUMERIC,
    competition VARCHAR(50),
    search_intent VARCHAR(50),
    answer TEXT, -- Resposta para keywords tipo pergunta
    embedding VECTOR, -- Embedding para busca semântica
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(main_keyword_id, keyword) -- Evita duplicatas
);
```

#### `keyword_clusters` - Agrupamentos

```sql
CREATE TABLE keyword_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    main_keyword_id UUID REFERENCES main_keywords(id),
    cluster_name VARCHAR(255) NOT NULL,
    description TEXT,
    cluster_score NUMERIC, -- Score de relevância do cluster
    embedding VECTOR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### **3. SISTEMA DE CONTEÚDO**

#### `content_posts` - Posts/Artigos

```sql
CREATE TABLE content_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    author_id UUID NOT NULL REFERENCES authors(id),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    excerpt TEXT,
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, scheduled
    featured_image_url TEXT,
    seo_title VARCHAR(500),
    seo_description TEXT,
    focus_keyword VARCHAR(255), -- Keyword principal do post
    readability_score INTEGER,
    seo_score INTEGER,
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    wordpress_post_id SMALLINT, -- ID no WordPress (se aplicável)
    embedding VECTOR, -- Para busca semântica
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Status Possíveis:**

- `draft`: Rascunho
- `published`: Publicado
- `scheduled`: Agendado

#### Tabelas Relacionadas ao Conteúdo

```sql
-- Categorias dos posts
CREATE TABLE post_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES content_posts(id),
    category_name VARCHAR(255) NOT NULL
);

-- Tags dos posts
CREATE TABLE post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES content_posts(id),
    tag_name VARCHAR(255) NOT NULL
);

-- Metadados customizados
CREATE TABLE post_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES content_posts(id),
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### **4. SISTEMA DE MÍDIA**

#### `media_assets` - Imagens e Arquivos

```sql
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    post_id UUID REFERENCES content_posts(id),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### **5. OPORTUNIDADES DE CONTEÚDO**

#### `content_opportunities_categories` & `content_opportunities_clusters`

```sql
-- Oportunidades por categoria
CREATE TABLE content_opportunities_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    category_id UUID REFERENCES keyword_categories(id),
    assigned_to UUID REFERENCES authors(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    final_title VARCHAR(500),
    final_description TEXT,
    content_type VARCHAR(100), -- article, listicle, how-to, etc.
    target_keywords JSONB DEFAULT '[]'::jsonb,
    priority_score NUMERIC DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    embedding VECTOR,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### **6. SEO E ANALYTICS**

#### `serp_results` - Resultados do Google

```sql
CREATE TABLE serp_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    main_keyword_id UUID NOT NULL REFERENCES main_keywords(id),
    "position" INTEGER NOT NULL,
    title TEXT,
    url TEXT,
    domain VARCHAR(255),
    description TEXT,
    type VARCHAR(50), -- organic, featured_snippet, etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `analytics_metrics` - Métricas de Performance

```sql
CREATE TABLE analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id),
    post_id UUID REFERENCES content_posts(id),
    metric_date DATE NOT NULL,
    metric_type VARCHAR(100) NOT NULL, -- pageviews, clicks, impressions
    metric_value NUMERIC NOT NULL,
    source VARCHAR(100), -- google_analytics, search_console, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔗 **RELACIONAMENTOS**

### Diagrama de Relacionamentos

```
blogs (1:N com tudo)
├── main_keywords (1:N)
│   ├── keyword_variations (1:N)
│   ├── keyword_clusters (1:1 opcional)
│   └── serp_results (1:N)
├── content_posts (1:N)
│   ├── post_categories (1:N)
│   ├── post_tags (1:N)
│   ├── post_meta (1:N)
│   └── media_assets (1:N)
├── content_opportunities_* (1:N)
├── blog_categories (1:N)
├── blog_tags (1:N)
└── analytics_metrics (1:N)

authors (1:N)
├── content_posts (1:N)
└── content_opportunities_* (1:N)
```

### Foreign Keys Principais

```sql
-- Keywords
main_keywords.blog_id → blogs.id
keyword_variations.main_keyword_id → main_keywords.id
keyword_clusters.blog_id → blogs.id
keyword_clusters.main_keyword_id → main_keywords.id

-- Conteúdo
content_posts.blog_id → blogs.id
content_posts.author_id → authors.id
post_categories.post_id → content_posts.id
post_tags.post_id → content_posts.id
post_meta.post_id → content_posts.id

-- Mídia
media_assets.blog_id → blogs.id
media_assets.post_id → content_posts.id (opcional)

-- SEO
serp_results.main_keyword_id → main_keywords.id
analytics_metrics.blog_id → blogs.id
analytics_metrics.post_id → content_posts.id (opcional)
```

---

## 🔧 **APIs E FUNÇÕES**

### **Funções de Busca Semântica**

#### `find_similar_keywords(query_embedding, match_threshold, match_count)`

```sql
-- Busca keywords similares baseado em embedding
SELECT * FROM find_similar_keywords(
    '[0.1, 0.2, ...]'::vector, -- embedding da consulta
    0.8, -- threshold de similaridade (0-1)
    10   -- número máximo de resultados
);
```

#### `find_similar_posts(query_embedding, match_threshold, match_count)`

```sql
-- Busca posts similares
SELECT * FROM find_similar_posts(
    '[0.1, 0.2, ...]'::vector,
    0.8,
    5
);
```

#### `hybrid_search_posts(search_query, query_embedding, blog_id_filter, match_count)`

```sql
-- Busca híbrida (texto + semântica)
SELECT * FROM hybrid_search_posts(
    'marketing digital', -- busca textual
    '[0.1, 0.2, ...]'::vector, -- busca semântica
    'blog_uuid', -- filtro por blog (opcional)
    20 -- limite de resultados
);
```

### **Funções de Análise**

#### `calculate_keyword_opportunity_score(msv, kw_difficulty, cpc, competition, search_intent)`

```sql
-- Calcula score de oportunidade (0-100)
SELECT calculate_keyword_opportunity_score(1000, 45, 2.50, 'MEDIUM', 'commercial');
-- Retorna: 67.50
```

#### `analyze_content_gaps(p_blog_id, gap_threshold)`

```sql
-- Identifica lacunas de conteúdo
SELECT * FROM analyze_content_gaps(
    'blog_uuid',
    0.7 -- threshold para consideração de similaridade
);
```

#### `recommend_keywords_for_post(p_post_id, similarity_threshold, max_recommendations)`

```sql
-- Recomenda keywords para um post
SELECT * FROM recommend_keywords_for_post(
    'post_uuid',
    0.8, -- similaridade mínima
    10   -- máximo de recomendações
);
```

### **Funções Utilitárias**

#### `inserir_variacao_keyword()` - Inserção Segura

```sql
-- Insere variação sem duplicatas
CALL inserir_variacao_keyword(
    'main_keyword_uuid',
    'nova variação da keyword',
    'long-tail',
    500, -- msv
    35,  -- difficulty
    1.20, -- cpc
    'LOW',
    'informational',
    'Resposta para a pergunta...'
);
```

#### `get_niche_statistics()` - Estatísticas por Nicho

```sql
-- Estatísticas agrupadas por nicho
SELECT * FROM get_niche_statistics();
```

### **Funções de Monitoramento**

#### `check_embeddings_stats()` - Status dos Embeddings

```sql
-- Verifica completude dos embeddings
SELECT * FROM check_embeddings_stats();
```

#### `detect_semantic_duplicates()` - Duplicatas Semânticas

```sql
-- Detecta possíveis duplicatas
SELECT * FROM detect_semantic_duplicates('keyword_variations', 0.95);
SELECT * FROM detect_semantic_duplicates('content_posts', 0.90);
```

---

## 🧠 **SISTEMA DE EMBEDDINGS**

### **Tabelas com Embeddings**

- `content_posts.embedding` - Título + excerpt + conteúdo
- `keyword_variations.embedding` - Keyword + tipo + intenção
- `keyword_clusters.embedding` - Nome + descrição do cluster
- `content_opportunities_*.embedding` - Oportunidades de conteúdo

### **Geração Automática**

Os embeddings são gerados automaticamente via triggers usando funções específicas:

```sql
-- Triggers de embedding
trigger_content_posts_embedding_insert/update
trigger_keyword_variations_embedding_insert/update
trigger_keyword_clusters_embedding_insert/update
```

### **Funções de Conteúdo para Embedding**

```sql
-- Extrai conteúdo dos posts para embedding
content_post_content(input_record) → title + excerpt + content(8000 chars)

-- Extrai conteúdo das keywords para embedding
keyword_variation_content(input_record) → keyword + type + intent + competition

-- Extrai conteúdo dos clusters para embedding
keyword_cluster_content(input_record) → cluster_name + description
```

### **Índices Vetoriais (HNSW)**

```sql
-- Índices otimizados para busca vetorial
CREATE INDEX idx_content_posts_embedding
ON content_posts USING hnsw (embedding vector_cosine_ops)
WITH (m='16', ef_construction='64');

CREATE INDEX idx_keyword_variations_embedding
ON keyword_variations USING hnsw (embedding vector_cosine_ops)
WITH (m='16', ef_construction='64');
```

**Parâmetros HNSW:**

- `m='16'`: Número de conexões bidirecionais
- `ef_construction='64'`: Tamanho da lista dinâmica durante construção

---

## 🔒 **SEGURANÇA E RLS**

### **Row Level Security (RLS)**

Apenas a tabela `main_keywords` tem RLS ativo:

```sql
-- Políticas da tabela main_keywords
ALTER TABLE main_keywords ENABLE ROW LEVEL SECURITY;

-- SELECT: Usuários autenticados podem ver tudo
CREATE POLICY "Permitir seleção de palavras-chave principais para usuários"
ON main_keywords FOR SELECT TO authenticated USING (true);

-- INSERT: Usuários autenticados podem inserir
CREATE POLICY "Permitir inserção de palavras-chave principais para usuários"
ON main_keywords FOR INSERT TO authenticated WITH CHECK (true);

-- UPDATE: Apenas do próprio blog
CREATE POLICY "Permitir atualização de palavras-chave principais para usuár"
ON main_keywords FOR UPDATE TO authenticated
USING (auth.uid() = blog_id) WITH CHECK (true);

-- DELETE: Apenas do próprio blog
CREATE POLICY "Permitir exclusão de palavras-chave principais para usuários"
ON main_keywords FOR DELETE TO authenticated
USING (auth.uid() = blog_id);
```

### **Autenticação Supabase**

- Usa `auth.uid()` para identificar usuário
- Sistema baseado em JWT tokens
- Integração com providers externos (Google, GitHub, etc.)

### **Secrets Management**

```sql
-- Acesso seguro à chave da OpenAI
SELECT get_openai_api_key_from_vault();
```

---

## ⚡ **TRIGGERS E AUTOMAÇÕES**

### **Triggers de Timestamp**

Todas as tabelas principais têm trigger `update_updated_at_column()`:

```sql
-- Atualiza automaticamente updated_at
CREATE TRIGGER trigger_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Triggers de Embedding**

Geram embeddings automaticamente:

```sql
-- Ao inserir/atualizar post
CREATE TRIGGER trigger_content_posts_embedding_insert
AFTER INSERT ON content_posts
FOR EACH ROW EXECUTE FUNCTION util.queue_embeddings('public.content_post_content', 'embedding');
```

### **Triggers de Validação**

```sql
-- Valida e normaliza keywords
CREATE TRIGGER trigger_validate_keyword_variations
BEFORE INSERT OR UPDATE ON keyword_variations
FOR EACH ROW EXECUTE FUNCTION validate_keyword_variations();

-- Normaliza categorias
CREATE TRIGGER trigger_validate_post_categories
BEFORE INSERT OR UPDATE ON post_categories
FOR EACH ROW EXECUTE FUNCTION validate_post_categories();
```

### **Triggers de Integridade**

```sql
-- Limpa dados relacionados ao deletar
CREATE TRIGGER trigger_delete_related_data_posts
BEFORE DELETE ON content_posts
FOR EACH ROW EXECUTE FUNCTION delete_related_data();

-- Marca keyword como usada
CREATE TRIGGER trigger_mark_keyword_as_used
AFTER INSERT OR UPDATE ON content_posts
FOR EACH ROW EXECUTE FUNCTION mark_keyword_as_used();
```

---

## 📊 **CONSULTAS ÚTEIS PARA FRONTEND**

### **Dashboard Principal**

```sql
-- Estatísticas gerais do blog
SELECT
    b.name,
    COUNT(DISTINCT mk.id) as total_keywords,
    COUNT(DISTINCT cp.id) as total_posts,
    COUNT(DISTINCT CASE WHEN cp.status = 'published' THEN cp.id END) as published_posts,
    COUNT(DISTINCT CASE WHEN mk.is_used = true THEN mk.id END) as used_keywords
FROM blogs b
LEFT JOIN main_keywords mk ON b.id = mk.blog_id
LEFT JOIN content_posts cp ON b.id = cp.blog_id
WHERE b.id = $1
GROUP BY b.id, b.name;
```

### **Lista de Posts com Métricas**

```sql
-- Posts com informações completas
SELECT
    cp.id,
    cp.title,
    cp.slug,
    cp.status,
    cp.published_at,
    cp.word_count,
    cp.seo_score,
    cp.readability_score,
    cp.focus_keyword,
    a.name as author_name,
    STRING_AGG(DISTINCT pc.category_name, ', ') as categories,
    STRING_AGG(DISTINCT pt.tag_name, ', ') as tags
FROM content_posts cp
JOIN authors a ON cp.author_id = a.id
LEFT JOIN post_categories pc ON cp.id = pc.post_id
LEFT JOIN post_tags pt ON cp.id = pt.post_id
WHERE cp.blog_id = $1
GROUP BY cp.id, cp.title, cp.slug, cp.status, cp.published_at,
         cp.word_count, cp.seo_score, cp.readability_score,
         cp.focus_keyword, a.name
ORDER BY cp.updated_at DESC;
```

### **Keywords com Oportunidades**

```sql
-- Keywords ordenadas por oportunidade
SELECT
    mk.id,
    mk.keyword,
    mk.msv,
    mk.kw_difficulty,
    mk.cpc,
    mk.competition,
    mk.search_intent,
    mk.is_used,
    calculate_keyword_opportunity_score(mk.msv, mk.kw_difficulty, mk.cpc, mk.competition, mk.search_intent) as opportunity_score,
    COUNT(kv.id) as variations_count
FROM main_keywords mk
LEFT JOIN keyword_variations kv ON mk.id = kv.main_keyword_id
WHERE mk.blog_id = $1
GROUP BY mk.id, mk.keyword, mk.msv, mk.kw_difficulty, mk.cpc, mk.competition, mk.search_intent, mk.is_used
ORDER BY opportunity_score DESC, mk.msv DESC;
```

### **Busca de Posts (Híbrida)**

```sql
-- Busca combinando texto e semântica
SELECT * FROM hybrid_search_posts(
    $1, -- termo de busca
    NULL, -- embedding (será gerado pelo frontend)
    $2, -- blog_id
    20  -- limite
);
```

### **Análise de Performance SEO**

```sql
-- Performance de keywords vs posts
SELECT
    mk.keyword,
    mk.msv,
    mk.kw_difficulty,
    cp.title as post_title,
    cp.seo_score,
    cp.published_at,
    AVG(sr.position) as avg_serp_position
FROM main_keywords mk
LEFT JOIN content_posts cp ON mk.keyword = cp.focus_keyword AND mk.blog_id = cp.blog_id
LEFT JOIN serp_results sr ON mk.id = sr.main_keyword_id
WHERE mk.blog_id = $1 AND mk.is_used = true
GROUP BY mk.id, mk.keyword, mk.msv, mk.kw_difficulty, cp.title, cp.seo_score, cp.published_at
ORDER BY mk.msv DESC;
```

---

## 🎨 **CASOS DE USO FRONTEND**

### **1. Dashboard de Blog**

```javascript
// Componentes necessários:
-BlogStatsCard(keywords, posts, performance) -
  RecentPostsList -
  TopKeywordsChart -
  ContentCalendar -
  SEOScoreGauge;
```

### **2. Gerenciador de Keywords**

```javascript
// Funcionalidades:
- KeywordsList (filtros: MSV, difficulty, used/unused)
- KeywordDetail (variações, clusters, oportunidades)
- KeywordImporter (CSV, API DataForSEO)
- OpportunityScore Calculator
- SemanticSearch (keywords similares)
```

### **3. Editor de Posts**

```javascript
// Recursos:
- RichTextEditor (Markdown/WYSIWYG)
- SEOAnalyzer (focus keyword, readability)
- KeywordRecommendations (baseado em conteúdo)
- MetaEditor (title, description, tags)
- MediaLibrary (imagens, assets)
- PublishingScheduler
```

### **4. Análise de Conteúdo**

```javascript
// Dashboards:
-ContentGapAnalysis -
  CompetitorAnalysis(SERP) -
  PerformanceMetrics(GA, GSC) -
  SemanticSimilarity(duplicatas) -
  ContentOpportunities;
```

### **5. Sistema de Busca**

```javascript
// Tipos de busca:
- TextSearch (PostgreSQL full-text)
- SemanticSearch (embeddings)
- HybridSearch (combinado)
- FilteredSearch (por status, autor, etc.)
```

---

## 🛠️ **EXTENSÕES E CONFIGURAÇÕES**

### **Extensões Instaladas**

```sql
-- Core
vector (0.8.0) -- Embeddings vetoriais
uuid-ossp (1.1) -- Geração de UUIDs
pgcrypto (1.3) -- Criptografia

-- Supabase
supabase_vault (0.3.1) -- Secrets management
pg_graphql (1.5.11) -- GraphQL API
pg_net (0.14.0) -- HTTP requests

-- Automação
pg_cron (1.6) -- Scheduled jobs
pgmq (1.4.4) -- Message queues

-- Monitoramento
pg_stat_statements (1.11) -- Query stats
hstore (1.8) -- Key-value storage
http (1.6) -- HTTP client
```

### **Configurações Recomendadas**

#### **Variáveis de Ambiente**

```env
# API Keys
OPENAI_API_KEY=sk-... # Armazenada no Supabase Vault
DATAFORSEO_LOGIN=seu_login
DATAFORSEO_PASSWORD=sua_senha

# Supabase
SUPABASE_URL=https://wayzhnpwphekjuznwqnr.supabase.co
SUPABASE_ANON_KEY=eyJ... # Chave pública
SUPABASE_SERVICE_KEY=eyJ... # Chave de serviço (backend only)

# Embedding
EMBEDDING_MODEL=text-embedding-3-small # OpenAI model
EMBEDDING_DIMENSIONS=1536 # Dimensões do vetor
```

#### **Configurações de Performance**

```sql
-- Configurações para embeddings
SET max_parallel_workers_per_gather = 4;
SET work_mem = '256MB';
SET shared_preload_libraries = 'vector';

-- Configurações HNSW
SET hnsw.ef_search = 100; -- Qualidade vs velocidade na busca
```

---

## 📋 **CHECKLIST PARA DESENVOLVIMENTO FRONTEND**

### **Setup Inicial**

- [ ] Configurar Supabase client
- [ ] Implementar autenticação (auth.uid())
- [ ] Configurar RLS policies para todas as tabelas
- [ ] Setup de tipos TypeScript das tabelas

### **Componentes Core**

- [ ] BlogSelector (multi-tenant)
- [ ] DataTable genérico (ordenação, filtros, paginação)
- [ ] SEOScoreIndicator
- [ ] EmbeddingStatus (mostra progresso dos embeddings)
- [ ] KeywordDifficultyGauge
- [ ] MSVChart (volume de busca)

### **Integrações**

- [ ] OpenAI API (geração de embeddings)
- [ ] DataForSEO API (dados de keywords)
- [ ] Google Analytics (métricas)
- [ ] WordPress API (sincronização de posts)

### **Funcionalidades Avançadas**

- [ ] Real-time updates (Supabase subscriptions)
- [ ] Bulk operations (importação em lote)
- [ ] Export/Import (CSV, JSON)
- [ ] Backup e restore
- [ ] Multi-language support

### **Performance**

- [ ] Implementar paginação em todas as listas
- [ ] Cache de consultas frequentes
- [ ] Lazy loading de embeddings
- [ ] Otimização de queries N+1
- [ ] Monitoramento de performance

---

## 🚨 **CONSIDERAÇÕES IMPORTANTES**

### **Limitações Atuais**

- RLS apenas em `main_keywords` (implementar nas outras tabelas)
- Embeddings são gerados assincronamente (UI deve mostrar status)
- Algumas funções exigem embedding pré-calculado
- Sistema multi-tenant não totalmente implementado

### **Melhorias Sugeridas**

- Implementar RLS em todas as tabelas
- Adicionar índices compostos baseados em queries frequentes
- Sistema de cache para consultas de embeddings
- Auditoria de mudanças (logs de alterações)
- Sistema de backup automatizado

### **Segurança**

- Sempre usar prepared statements
- Validar inputs no frontend E backend
- Implementar rate limiting
- Logs de auditoria para ações críticas
- Criptografia de dados sensíveis

---

_Documento gerado em: Dezembro 2024_  
_Versão do Banco: PostgreSQL 17.4.1_  
_Última atualização: [Data atual]_
