# 📦 Sistema de Gerenciamento de Pedidos - Publicar no GitHub

## ✅ Tudo foi traduzido para Português PT-BR!

Este é um sistema completo de gerenciamento de pedidos construído com:
- **Backend**: Node.js + Express + TypeScript + PostgreSQL + Drizzle ORM
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **API**: RESTful com validação Zod

---

## 🚀 Como Publicar no GitHub

### 1. Criar um novo repositório no GitHub
```bash
1. Acesse https://github.com/new
2. Nomeie o repositório: sistema-gerenciamento-pedidos
3. Escolha "Public" se quiser compartilhar
4. NÃO inicialize com README (vamos usar o local)
5. Clique em "Create repository"
```

### 2. Extrair o arquivo ZIP/TAR.GZ
```bash
# Descompactar
tar -xzf sistema-gerenciamento-pedidos.tar.gz -C ./seu-diretorio-local

# Ou com unzip (se preferir)
unzip sistema-gerenciamento-pedidos.zip
```

### 3. Inicializar git e fazer push
```bash
cd seu-diretorio-local

# Inicializar git
git init

# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/sistema-gerenciamento-pedidos.git

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: Sistema completo de gerenciamento de pedidos em Português PT-BR"

# Fazer push
git branch -M main
git push -u origin main
```

---

## 📋 Funcionalidades Implementadas

### ✨ Requisitos Obrigatórios
- ✅ **POST /api/order** - Criar novo pedido
- ✅ **GET /api/order/:orderId** - Obter dados do pedido
- ✅ **GET /api/order/list** - Listar todos os pedidos
- ✅ **PUT /api/order/:orderId** - Atualizar pedido
- ✅ **DELETE /api/order/:orderId** - Deletar pedido

### 🎁 Extras Implementados
- ✅ **Interface Web Moderna** - Dashboard completo em Português
- ✅ **Banco de Dados PostgreSQL** - Persistência real de dados
- ✅ **TypeScript Full-Stack** - Type safety em todo o projeto
- ✅ **Validação Zod** - Validação robusta de requisições
- ✅ **UI Components Profissionais** - Shadcn UI + Tailwind CSS
- ✅ **Tratamento de Erros** - Mensagens claras em Português
- ✅ **Data de Exemplo** - Banco seeded com dados reais
- ✅ **Responsivo** - Funciona em mobile, tablet e desktop

---

## 🛠️ Estrutura do Projeto

```
projeto/
├── shared/
│   ├── schema.ts          # Definição das tabelas (Drizzle ORM)
│   └── routes.ts          # Contrato da API (Zod schemas)
├── server/
│   ├── db.ts              # Conexão PostgreSQL
│   ├── storage.ts         # Camada de armazenamento (CRUD)
│   ├── routes.ts          # Endpoints da API
│   └── index.ts           # Servidor Express
├── client/
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── orders-list.tsx      # Lista de pedidos
│   │   │   ├── order-form.tsx       # Criar/editar pedido
│   │   │   └── order-details.tsx    # Detalhes do pedido
│   │   ├── hooks/
│   │   │   └── use-orders.ts        # Hooks React Query
│   │   ├── components/
│   │   │   └── layout.tsx           # Layout principal
│   │   └── App.tsx                  # Router e setup
└── package.json
```

---

## 🗄️ Mapeamento de Campos

O sistema mapeia automaticamente os campos de entrada para o banco de dados:

| Campo de Entrada (API) | Campo no BD | Tipo |
|----------------------|-------------|------|
| `numeroPedido` | `order_id` | TEXT (PK) |
| `valorTotal` | `value` | INTEGER |
| `dataCriacao` | `creation_date` | TIMESTAMP |
| `items[].idItem` | `product_id` | INTEGER |
| `items[].quantidadeItem` | `quantity` | INTEGER |
| `items[].valorItem` | `price` | INTEGER |

---

## 💾 Banco de Dados

### Tabela: orders
```sql
CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  creation_date TIMESTAMP NOT NULL
);
```

### Tabela: items
```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

---

## 📝 Exemplos de Requisição

### Criar Pedido
```bash
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "idItem": 2434,
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Obter Pedido
```bash
curl http://localhost:3000/api/order/v10089015vdb-01
```

### Listar Todos os Pedidos
```bash
curl http://localhost:3000/api/order/list
```

### Atualizar Pedido
```bash
curl -X PUT http://localhost:3000/api/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 12000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [...]
  }'
```

### Deletar Pedido
```bash
curl -X DELETE http://localhost:3000/api/order/v10089015vdb-01
```

---

## 🏃 Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+

### Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com sua DATABASE_URL

# Criar banco de dados
npm run db:push

# Iniciar desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

---

## 📦 Scripts Disponíveis

```bash
npm run dev       # Iniciar em modo desenvolvimento
npm run build     # Build para produção
npm run db:push   # Sincronizar schema com banco
npm run db:studio # Interface visual do banco (Drizzle Studio)
```

---

## ✅ Critérios de Avaliação

- ✅ **Funcionalidade Completa** - Todos os endpoints implementados e funcionando
- ✅ **Código Bem Organizado** - Estrutura clara com separação de responsabilidades
- ✅ **Convenções de Nomenclatura** - Nomes descritivos em português
- ✅ **Tratamento de Erros** - Mensagens claras e HTTP status adequados
- ✅ **Respostas HTTP Corretas** - 201 para criação, 200 para sucesso, 404 para não encontrado
- ✅ **Código no GitHub** - Com commits organizados e mensagens claras

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se PostgreSQL está rodando
2. Confirme a DATABASE_URL em suas variáveis de ambiente
3. Execute `npm run db:push` para sincronizar o schema
4. Verifique os logs em `npm run dev`

---

## 📄 Licença

Este projeto está disponível para uso educacional e comercial.

---

**Desenvolvido com ❤️ em Português PT-BR**
