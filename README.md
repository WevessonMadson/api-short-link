# 🔗 api-short-link

## 📌 Descrição

**api-short-link** é uma API REST desenvolvida com **NestJS**, **TypeScript** e **Prisma** para fornecer os endpoints necessários à criação e gerenciamento de links encurtados (“short links”).  
A API aceita URLs longas e retorna versões encurtadas, além de permitir redirecionamento ou consulta das URLs originais por meio de identificadores únicos.

O projeto foi estruturado de forma modular, segura e escalável, com foco na organização de rotas, validação de dados e integração com banco de dados, facilitando seu uso em aplicações frontend ou serviços externos.

---

## 🧠 Tecnologias utilizadas

O projeto foi construído com as seguintes tecnologias:

- **NestJS** — Framework Node.js para construção de APIs modulares e escaláveis.
- **TypeScript** — Tipagem estática para maior confiabilidade e clareza no código.
- **Prisma** — ORM moderno para comunicação com banco de dados.
- **Node.js** — Plataforma de execução JavaScript no backend.
- **PostgreSQL** (ou outro banco relacional) — Armazenamento dos dados de URLs encurtadas.
- **Vercel / Render / Railway** — Plataformas possíveis para deploy da API.
- **ESLint** — Ferramenta de linting para manter o código consistente.

---

## 🚀 Funcionalidades

- ✂️ Endpoint para **encurtar URLs longas** através de requisições POST.
- 🔍 Endpoint para **buscar informações de um short link** via identificador.
- 🔄 Redirecionamento automático ou retorno do link original.
- 🧪 Validação de URLs, tratamento de erros e respostas padronizadas.
- 📦 Integração com banco de dados usando **Prisma Migrations**.
- 🔧 Estrutura modular e organizada conforme melhores práticas de APIs REST.

---

## 📁 Estrutura do projeto

```text
api-short-link/
├── example/                # Exemplos de requisições ou scripts auxiliares
├── prisma/                 # Prisma schema e migrations
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── modules/            # Módulos de domínio (ex: short-link)
│   ├── common/             # Utilitários, filtros, interceptors
│   ├── main.ts             # Ponto de entrada da aplicação
│   └── app.module.ts       # Configuração dos módulos
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── prisma/
├── vercel.json             # Configuração de deploy (quando aplicável)
└── eslint.config.js
