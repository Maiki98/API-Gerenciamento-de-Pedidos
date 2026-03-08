import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Tabela de Pedidos
export const orders = pgTable("orders", {
  orderId: text("order_id").primaryKey(),
  value: integer("value").notNull(),
  creationDate: timestamp("creation_date").notNull(),
});

// Tabela de Itens do Pedido
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

// Relacionamentos entre Pedidos e Itens
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  order: one(orders, {
    fields: [items.orderId],
    references: [orders.orderId],
  }),
}));

export const itemInputSchema = z.object({
  idItem: z.union([z.string(), z.number()]).transform(v => Number(v)),
  quantidadeItem: z.number(),
  valorItem: z.number(),
});

export const orderInputSchema = z.object({
  numeroPedido: z.string(),
  valorTotal: z.number(),
  dataCriacao: z.string().transform(v => new Date(v)),
  items: z.array(itemInputSchema),
});

export type ItemInput = z.infer<typeof itemInputSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;

export type Order = typeof orders.$inferSelect;
export type Item = typeof items.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type InsertItem = typeof items.$inferInsert;

export type OrderWithItems = Order & { items: Item[] };
