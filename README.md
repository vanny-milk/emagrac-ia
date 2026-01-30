# emagrec.ia

Sua saúde guiada por IA. A maneira mais inteligente de calcular sua taxa metabólica.

## Principais Funcionalidades

- **Home**: Visão geral das funcionalidades e propósito do aplicativo.
- **Ficha do Usuário (/calculate)**: Formulário para coleta de dados de saúde do usuário.
- **Dashboard (/dashboard)**: Visualização do progresso e Taxa Metabólica Basal (TMB).

## Estrutura do Código

- **`src/pages`**: Contém as páginas principais da aplicação:
  - `Home.tsx`: Página inicial.
  - `Calculate.tsx`: Página de cálculo e formulário.
  - `Dashboard.tsx`: Painel de resultados.
- **`src/components`**: Componentes de UI reutilizáveis.
- **`services`**: Integrações com backend e IA (e.g., `geminiService.ts`).

## Como Rodar Localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a API Key do Gemini no arquivo `.env.local`:
   ```bash
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. Execute a aplicação:
   ```bash
   npm run dev
   ```
