# Cadeconsig - Frontend

Sistema web para gerenciamento de contratos desenvolvido com Next.js, React e TypeScript.

## Visão Geral

Aplicação para gerenciar contratos de clientes com interface moderna e responsiva. O sistema permite cadastrar, visualizar, editar e importar contratos em massa através de arquivos CSV.

### Funcionalidades Principais

**Autenticação:** Sistema de login com JWT para controle de acesso ao sistema.

**Dashboard:** Tela inicial com visão geral dos contratos, exibindo métricas como total de clientes, contratos ativos/inativos, receita mensal e distribuição por tipo de plano.

**Listagem de Contratos:** Página principal com tabela de contratos incluindo:
- Paginação (10, 20, 50 ou 100 itens por página)
- Filtros por nome, email, plano e status
- Ações para ativar/inativar ou excluir contratos

**Upload de CSV:** Importação em massa de contratos com:
- Preview antes de confirmar o upload
- Identificação de registros novos, existentes e que serão atualizados
- Validação de formato e dados
- Tratamento automático de duplicatas



## Tecnologias Utilizadas

- Next.js 15 com App Router
- React 
- TypeScript
- TailwindCSS 
- TanStack Query (gerenciamento de estado)
- React Hook Form + Zod (formulários e validação)
- Radix UI (componentes acessíveis)
- Axios (requisições HTTP)


### Instalação

bash
cd upload-contratos/frontend
npm install
npm run dev


Acesse: `http://localhost:3000`

Login padrão: **admin** / **admin123**


## Estrutura do Projeto


frontend/
├── app/                    # Páginas e rotas
│   ├── contratos/          # Listagem de contratos
│   ├── login/              # Tela de login
│   └── upload/             # Upload de CSV
├── components/             # Componentes reutilizáveis
│   ├── dashboard.tsx       # Dashboard com métricas
│   └── ui/                 # Componentes de interface
├── contexts/               # Contexto de autenticação
├── hooks/                  # Hooks customizados
└── lib/                    # Utilitários e configurações

## Desenvolvedor

Pedro Henrique Pereira Alves

Projeto desenvolvido como parte do desafio técnico Cadeconsig.
