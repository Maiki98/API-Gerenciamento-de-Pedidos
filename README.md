# 📦 Sistema de Gerenciamento de Pedidos


![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18%2B-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Funcionalidades

### ✅ Requisitos Obrigatórios
- **POST /api/order** - Criar novo pedido
- **GET /api/order/:orderId** - Obter dados do pedido
- **GET /api/order/list** - Listar todos os pedidos
- **PUT /api/order/:orderId** - Atualizar pedido
- **DELETE /api/order/:orderId** - Deletar pedido

### 🎁 Extras
- Dashboard moderno e responsivo
- Validação de dados com Zod
- TypeScript full-stack
- Banco de dados pré-populado com exemplos
- Tratamento robusto de erros

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
|-----------|-----------|
| **Backend** | Node.js, Express, TypeScript |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL 13+ |
| **ORM** | Drizzle ORM |
| **Validação** | Zod |
| **UI Components** | Shadcn UI |
| **State Management** | React Query (TanStack Query) |
| **Routing** | Wouter |
| **Build** | Vite, TSX |

---

## 📁 Estrutura do Projeto

```
projeto/
├── shared/
│   ├── schema.ts              # Definição das tabelas (Drizzle)
│   └── routes.ts              # Contrato da API (Zod schemas)
├── server/
│   ├── db.ts                  # Conexão PostgreSQL
│   ├── storage.ts             # Camada CRUD
│   ├── routes.ts              # Endpoints da API
│   ├── index.ts               # Servidor Express
│   ├── vite.ts                # Configuração Vite
│   └── static.ts              # Arquivos estáticos
├── client/
│   ├── src/
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── orders-list.tsx       # Lista de pedidos
│   │   │   ├── order-form.tsx        # Criar/editar pedido
│   │   │   └── order-details.tsx     # Detalhes do pedido
│   │   ├── hooks/
│   │   │   └── use-orders.ts         # Hooks React Query
│   │   ├── components/
│   │   │   └── layout.tsx            # Layout principal
│   │   ├── lib/
│   │   │   └── queryClient.ts        # Configuração React Query
│   │   ├── index.css                 # Estilos globais
│   │   └── App.tsx                   # Router principal
│   └── index.html
├── script/
│   └── build.ts               # Script de build
├── .replit                    # Configuração Replit
├── drizzle.config.ts          # Configuração Drizzle
├── vite.config.ts             # Configuração Vite
├── tailwind.config.ts         # Configuração Tailwind
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências
└── README.md
```

---

## 🗄️ Modelo de Dados

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

### Mapeamento de Campos
| Campo de Entrada (API) | Campo no BD | Tipo |
|----------------------|-------------|------|
| `numeroPedido` | `order_id` | TEXT |
| `valorTotal` | `value` | INTEGER |
| `dataCriacao` | `creation_date` | TIMESTAMP |
| `items[].idItem` | `product_id` | INTEGER |
| `items[].quantidadeItem` | `quantity` | INTEGER |
| `items[].valorItem` | `price` | INTEGER |

---

A aplicação está disponível em **`http://localhost:5000`**

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar em modo desenvolvimento

# Banco de Dados
npm run db:push         # Sincronizar schema com o banco
npm run db:studio       # Abrir interface visual do banco (Drizzle Studio)

# Build
npm run build          # Build para produção
npm run start          # Iniciar versão produção
```

---

## 🔌 Exemplos de API

### ➕ Criar Pedido
```bash
curl -X POST http://localhost:5000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "ORD-2024-001",
    "valorTotal": 25000,
    "dataCriacao": "2024-03-08T10:30:00Z",
    "items": [
      {
        "idItem": 101,
        "quantidadeItem": 2,
        "valorItem": 12500
      }
    ]
  }'
```

**Resposta (201):**
```json
{
  "orderId": "ORD-2024-001",
  "value": 25000,
  "creationDate": "2024-03-08T10:30:00Z",
  "items": [
    {
      "id": 1,
      "orderId": "ORD-2024-001",
      "productId": 101,
      "quantity": 2,
      "price": 12500
    }
  ]
}
```

### 🔍 Obter Pedido
```bash
curl http://localhost:5000/api/order/ORD-2024-001
```

### 📋 Listar Todos os Pedidos
```bash
curl http://localhost:5000/api/order/list
```

### ✏️ Atualizar Pedido
```bash
curl -X PUT http://localhost:5000/api/order/ORD-2024-001 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "ORD-2024-001",
    "valorTotal": 30000,
    "dataCriacao": "2024-03-08T10:30:00Z",
    "items": [
      {
        "idItem": 101,
        "quantidadeItem": 2,
        "valorItem": 15000
      }
    ]
  }'
```

### 🗑️ Deletar Pedido
```bash
curl -X DELETE http://localhost:5000/api/order/ORD-2024-001
```

---

## 📊 Códigos HTTP

| Status | Significado | Quando Ocorre |
|--------|-----------|---------------|
| **200** | OK | Requisição bem-sucedida (GET, PUT) |
| **201** | Criado | Pedido criado com sucesso (POST) |
| **204** | Sem Conteúdo | Pedido deletado (DELETE) |
| **400** | Erro de Validação | Dados inválidos enviados |
| **404** | Não Encontrado | Pedido não existe |
| **500** | Erro Servidor | Erro interno do servidor |

---

## 🧪 Dados de Exemplo

O banco de dados é pré-populado com dois pedidos de exemplo:

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

---

## 🔒 Validação de Dados

Todos os inputs são validados usando **Zod** no servidor:

```typescript
// Validação de Pedido
{
  numeroPedido: string      // ID único do pedido
  valorTotal: number        // Valor total (>= 0)
  dataCriacao: string       // Data ISO 8601
  items: [
    {
      idItem: number        // ID do produto
      quantidadeItem: number // Quantidade (>= 1)
      valorItem: number     // Preço unitário (>= 0)
    }
  ]
}
```

---

## 📱 Interface do Usuário

### Páginas Principais

#### Dashboard (Lista de Pedidos)
- Visualizar todos os pedidos em cards
- Pesquisar pedidos por ID
- Ver resumo: valor, data e quantidade de itens
- Botões rápidos: editar, deletar, ver detalhes

#### Criar/Editar Pedido
- Formulário com validação em tempo real
- Adicionar/remover múltiplos itens
- Cálculo automático do total
- Feedback visual de sucesso/erro

#### Detalhes do Pedido
- Visualização completa do pedido
- Tabela de itens com valores
- Botão para editar
- Design de nota fiscal

---

## 🎨 Design

- **Paleta de Cores**: Profissional e moderna
- **Tipografia**: Limpa e legível
- **Responsivo**: Funciona em mobile, tablet e desktop
- **Acessibilidade**: Contraste adequado, navegação via teclado
- **Performance**: Otimizado para rápido carregamento

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│           Browser (React Frontend)               │
│  ┌────────────────────────────────────────────┐ │
│  │  Pages (orders-list, form, details)        │ │
│  │  ↓                                          │ │
│  │  React Query (useOrders hook)              │ │
│  └────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │ HTTP REST
                   ↓
┌─────────────────────────────────────────────────┐
│        Node.js Backend (Express)                 │
│  ┌────────────────────────────────────────────┐ │
│  │  API Routes (/api/order/*)                 │ │
│  │  ↓                                          │ │
│  │  Zod Validation                            │ │
│  │  ↓                                          │ │
│  │  Storage Layer (DatabaseStorage)           │ │
│  │  ↓                                          │ │
│  │  Drizzle ORM                               │ │
│  └────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │ SQL
                   ↓
┌─────────────────────────────────────────────────┐
│        PostgreSQL Database                       │
│  ┌────────────────────────────────────────────┐ │
│  │  tables: orders, items                     │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 📚 Dependências Principais

### Backend
- **express** - Framework web
- **drizzle-orm** - ORM TypeScript
- **pg** - Driver PostgreSQL
- **zod** - Validação de schemas

### Frontend
- **react** - UI library
- **@tanstack/react-query** - Gerenciamento de estado assíncrono
- **wouter** - Roteamento leve
- **tailwindcss** - Estilos utilitários
- **shadcn/ui** - Componentes UI
- **react-hook-form** - Gerenciamento de formulários

---

## 🐛 Troubleshooting

### Erro: `DATABASE_URL not set`
```bash
# Certifique-se de que o arquivo .env existe e tem DATABASE_URL
cat .env
```

### Erro: `Failed to connect to database`
```bash
# Verifique se PostgreSQL está rodando
psql -U seu_usuario -d postgres

# Verifique as credenciais no .env
```

### Porta 5000 já em uso
```bash
# Encontre o processo usando a porta
lsof -i :5000

# Mate o processo
kill -9 <PID>
```

### Erro de sincronização do banco
```bash
# Force a sincronização
npm run db:push -- --force
```

---

## 📖 Documentação

Para mais detalhes sobre:
- **Desenvolvimento**: Veja `server/` e `client/` readmes
- **Banco de Dados**: Veja `shared/schema.ts`
- **API**: Veja `shared/routes.ts`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Maiki aka lv0nihil

---

1. Verifique o arquivo `.env` e certifique-se de que `DATABASE_URL` está configurado
2. Confirme que PostgreSQL está rodando
3. Execute `npm install` para garantir que todas as dependências estão instaladas
4. Verifique os logs: `npm run dev`
5. Abra uma Issue no repositório

---

## 🗓️ Changelog

### v1.0.0 (2024-03-08)
- ✅ Sistema completo de CRUD de pedidos
- ✅ Validação robusta com Zod
- ✅ TypeScript full-stack
- ✅ PostgreSQL com dados de exemplo

---
