# Sistema Biblioteca - API

## Pré-requisitos

- Node.js 18+
- SQL Server rodando em `localhost` com banco `tabalhodb`

## Configuração do Banco

Executar os scripts em ordem no SQL Server Management Studio ou equivalente:

| Arquivo | Descrição |
|---------|-----------|
| `database/struct.sql` | Cria as tabelas (aluno, livro, exemplar, empréstimo, reserva, etc.) |
| `database/precedures.sql` | Cria as stored procedures de CRUD de aluno e movimentação de empréstimo |
| `database/inserts.sql` | Povoa o banco com dados de exemplo |

## Instalar dependências

```bash
npm install
```

## Rodar

```bash
npm start
```

Servidor disponível em `http://localhost:3000`. O frontend é servido junto na mesma porta.

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/alunos` | Criar aluno |
| GET | `/api/alunos` | Listar alunos (`?matricula=XXX` para filtrar) |
| PUT | `/api/alunos/:id` | Atualizar aluno |
| DELETE | `/api/alunos/:id` | Excluir aluno |
| POST | `/api/emprestimos` | Registrar empréstimo |
| GET | `/api/emprestimos` | Listar empréstimos ativos (para o select de devolução) |
| PUT | `/api/emprestimos/:id/devolver` | Registrar devolução |
| GET | `/api/exemplares` | Listar exemplares (para o select de empréstimo) |
| GET | `/api/funcionarios` | Listar funcionários (para o select de empréstimo) |
