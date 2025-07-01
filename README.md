# Content Hub - Plataforma Avançada de Gestão de Conteúdo

O Content Hub é uma aplicação web completa, desenvolvida com Next.js e TypeScript, projetada para otimizar a gestão de conteúdo, SEO e monetização de blogs. A plataforma se integra diretamente com o WordPress e oferece uma interface rica e reativa para gerenciar posts, palavras-chave, análises de SEO, oportunidades de conteúdo e muito mais.

## ✨ Funcionalidades Principais

- **Dashboard Centralizado:** Visão geral da performance do blog, com métricas chave e ações rápidas.
- **Gestão de Conteúdo:** Crie, edite, publique e gerencie posts com um editor de texto rico e integrado.
- **Otimização de SEO:** Ferramentas para análise de SEO, gerenciamento de palavras-chave e sugestões de otimização.
- **Integração com WordPress:** Sincronização bidirecional de posts, categorias, tags e mídia. **Suporte a múltiplos blogs.**
- **Análise de Performance:** Gráficos e relatórios detalhados sobre o desempenho do conteúdo e SEO.
- **Oportunidades de Conteúdo:** Identifique e gerencie novas ideias de conteúdo com base em categorias e clusters de palavras-chave.
- **Monetização:** Configure e monitore a receita de anúncios e programas de afiliados.
- **Automações com N8N:** Integre e gerencie workflows de automação para otimizar processos.
- **Busca Semântica:** Utilize IA para encontrar conteúdo relevante em toda a sua base de dados.
- **Configurações Personalizáveis:** Ajuste as configurações de tema, segurança, notificações e backup.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI/UX:** Shadcn/UI, Framer Motion, Lucide Icons
- **Gerenciamento de Estado:** Zustand
- **Requisições de Dados:** TanStack Query (React Query)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Gráficos:** Nivo
- **Editor de Texto:** TinyMCE
- **Automação:** N8N

## 🏁 Começando

Para executar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
    ```

4.  **Execute o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

5.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 📂 Estrutura do Projeto

```
/src
|-- /app                # Rotas da aplicação (App Router)
|   |-- /api            # Endpoints da API
|   |-- /dashboard      # Páginas do dashboard
|   |-- layout.tsx      # Layout principal
|   `-- page.tsx        # Página inicial
|-- /components         # Componentes React
|   |-- /features       # Componentes de funcionalidades específicas
|   |-- /layout         # Componentes de layout (header, sidebar)
|   `-- /ui             # Componentes de UI reutilizáveis (botões, cards)
|-- /lib                # Funções utilitárias e hooks
|   |-- /hooks          # Hooks customizados (usePosts, useKeywords)
|   |-- /services       # Serviços de integração (WordPress, N8N)
|   |-- /stores         # Gerenciamento de estado (Zustand)
|   `-- /supabase       # Configuração do cliente Supabase
`-- /styles             # Estilos globais
```

## 🛠️ Funcionalidades em Detalhe

### Dashboard

A página inicial oferece uma visão geral da performance do seu blog, incluindo:

- **Métricas Principais:** Total de posts, palavras-chave, SEO score médio.
- **Ações Rápidas:** Crie novos posts ou palavras-chave com um clique.
- **Keywords Não Utilizadas:** Identifique oportunidades de conteúdo com palavras-chave que ainda não foram usadas.

### Gestão de Posts

- **Tabela de Posts:** Visualize, filtre e ordene todos os seus posts.
- **Editor de Texto Rico:** Crie e edite posts com um editor completo, com suporte a formatação, imagens e HTML.
- **SEO Integrado:** Analise o SEO do seu post em tempo real enquanto escreve.

### Gestão de Palavras-chave

- **Tabela de Palavras-chave:** Gerencie suas palavras-chave principais, com dados de volume de busca, dificuldade e CPC.
- **Importação em Massa:** Importe listas de palavras-chave de arquivos CSV.

### Integração com WordPress

- **Múltiplos Blogs:** Gerencie diferentes sites WordPress a partir de uma única interface.
- **Configuração Flexível:** Use variáveis de ambiente (produção) ou configurações no banco (desenvolvimento).
- **Sincronização Automática:** Mantenha seus posts, categorias e tags sincronizados entre o Content Hub e o WordPress.
- **Painel de Controle:** Gerencie seu site WordPress diretamente da plataforma.

> 📖 **Configuração WordPress:** Veja o arquivo [WORDPRESS_CONFIG.md](./WORDPRESS_CONFIG.md) para instruções detalhadas sobre como configurar múltiplos blogs WordPress.

### Analytics

- **Gráficos Interativos:** Visualize a performance do seu conteúdo com gráficos de barras, linhas e pizza.
- **Análise de Conteúdo:** Acompanhe a performance por categoria e autor.
- **Análise de Duplicatas:** Encontre conteúdo similar e palavras-chave duplicadas.

### Monetização

- **Dashboard de Receita:** Monitore a receita de anúncios e programas de afiliados.
- **Configuração de Anúncios:** Configure seus slots de anúncios e otimize a performance.

### Automações (N8N)

- **Dashboard N8N:** Monitore e controle seus workflows de automação diretamente da plataforma.
- **Workflows Ativos:** Visualize quais automações estão em execução.
- **Histórico de Execuções:** Acompanhe o status de cada execução dos seus workflows.

## 🔌 API Endpoints

A aplicação possui os seguintes endpoints de API:

- `GET /api/check-url`: Verifica o status de uma URL.
- `GET /api/n8n-proxy`: Proxy para a API do N8N, permitindo a comunicação segura com o serviço.
- `POST /api/webhooks/wordpress/[blogId]`: Webhook para receber notificações de atualizações do WordPress.

## 🔒 Variáveis de Ambiente

Para rodar o projeto, você precisa configurar as seguintes variáveis de ambiente no seu arquivo `.env.local`:

### Supabase (Obrigatórias)

- `NEXT_PUBLIC_SUPABASE_URL`: A URL do seu projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A chave anônima (public) do seu projeto Supabase.

### WordPress (Opcionais - Para múltiplos blogs)

- `EINSOF7_WORDPRESS_URL`: URL do blog Einsof7
- `EINSOF7_WORDPRESS_USERNAME`: Usuário admin do WordPress
- `EINSOF7_WORDPRESS_PASSWORD`: App Password do WordPress
- `OPETMIL_WORDPRESS_URL`: URL do blog Opetmil
- `OPETMIL_WORDPRESS_USERNAME`: Usuário admin do WordPress
- `OPETMIL_WORDPRESS_PASSWORD`: App Password do WordPress

> 💡 **Veja o arquivo `.env.example` para a lista completa de variáveis disponíveis.**

## 🚀 Deploy

Para fazer o deploy da aplicação, você pode utilizar plataformas como Vercel, Netlify ou AWS Amplify. Certifique-se de configurar as variáveis de ambiente na sua plataforma de deploy.

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você quiser contribuir com o projeto, siga os passos abaixo:

1.  Faça um fork do repositório.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça suas alterações e commit (`git commit -m 'Adiciona nova feature'`).
4.  Envie para a sua branch (`git push origin feature/sua-feature`).
5.  Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
