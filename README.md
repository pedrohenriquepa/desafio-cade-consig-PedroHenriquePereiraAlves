# Desafio Cadeconsig - Full Stack

Este desafio e para vaga de desenvolvedor full stack. O backend esta pronto em NestJS e você deve:
1) configurar e rodar a API na sua máquina;
2) desenvolver um frontend básico que integre com a API.

A API oferece upload de CSV, listagem com filtros e paginacao. Usa Postgres via Docker Compose e Prisma ORM.


## Backend: setup e execucao

1) Suba o banco de dados

2) Configure o `.env`

3) Instale dependencias

4) rode as migrations

5) rode o seed

5) Suba a API localmente

## Frontend (a ser desenvolvido pelo candidato)

Crie uma aplicacao frontend (framework de sua escolha) que consuma a API. O frontend deve:
- permitir criar usuario e fazer login;
- armazenar o token JWT e enviar como `Authorization: Bearer <token>`;
- listar contratos com filtros e paginacao;
- realizar upload de CSV para cadastro de contratos.

## Endpoints

### POST /contratos/upload

Upload de CSV (multipart/form-data, campo `file`) com ate 100 linhas. O modelo do arquivo para upload
foi deixado na raiz do projeto com o nome contratos_100.csv.

Colunas esperadas:

- `nome` (string)
- `email` (string)
- `plano` (string) (Basico | Pro | Enterprise)
- `valor` (float)
- `status` (string) (Ativo | Inativo)
- `data_inicio` (date)

Exemplo com curl:

```bash
curl -X POST http://localhost:3000/contratos/upload ^
  -F "file=@contratos.csv"
```

Resposta:

```json
{
  "inserted": 10
}
```

### GET /contratos

Listagem com filtros e paginacao. Todos os campos podem ser filtrados.

Query params aceitos:

- `id_contrato`
- `nome_cliente`
- `email_cliente`
- `tipo_plano` (Basico | Pro | Enterprise)
- `valor_mensal`
- `status` (Ativo | Inativo)
- `data_inicio` (ISO 8601)
- `page` (default 1)
- `limit` (default 20, max 100)

Exemplos:

```bash
curl "http://localhost:3000/contratos?status=Ativo&page=1&limit=10"
```

```bash
curl "http://localhost:3000/contratos?email_cliente=gmail.com"
```

Resposta:

```json
{
  "items": [
    {
      "id_contrato": "c95b4d7f-9c0b-4e3c-bcb2-7b2df1b6cdb6",
      "nome_cliente": "Maria Silva",
      "email_cliente": "maria@exemplo.com",
      "tipo_plano": "BASICO",
      "valor_mensal": "99.90",
      "status": "ATIVO",
      "data_inicio": "2024-01-15T00:00:00.000Z",
      "created_at": "2024-07-01T12:00:00.000Z",
      "updated_at": "2024-07-01T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1,
  "totalPages": 1
}
```

