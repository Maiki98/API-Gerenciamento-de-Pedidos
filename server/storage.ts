import { db } from "./db";
import { eq } from "drizzle-orm";
import { orders, items, type OrderInput, type OrderWithItems } from "@shared/schema";

// Interface de armazenamento para operações CRUD de Pedidos
export interface IStorage {
  createOrder(order: OrderInput): Promise<OrderWithItems>;
  getOrder(orderId: string): Promise<OrderWithItems | undefined>;
  listOrders(): Promise<OrderWithItems[]>;
  updateOrder(orderId: string, order: OrderInput): Promise<OrderWithItems>;
  deleteOrder(orderId: string): Promise<void>;
}

// Implementação do armazenamento usando PostgreSQL
export class DatabaseStorage implements IStorage {
  async createOrder(orderInput: OrderInput): Promise<OrderWithItems> {
    const [newOrder] = await db.insert(orders).values({
      orderId: orderInput.numeroPedido,
      value: orderInput.valorTotal,
      creationDate: new Date(orderInput.dataCriacao),
    }).returning();

    const newItems = await db.insert(items).values(
      orderInput.items.map(item => ({
        orderId: newOrder.orderId,
        productId: item.idItem,
        quantity: item.quantidadeItem,
        price: item.valorItem,
      }))
    ).returning();

    return { ...newOrder, items: newItems };
  }

  async getOrder(orderId: string): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    if (!order) return undefined;

    const orderItems = await db.select().from(items).where(eq(items.orderId, orderId));
    return { ...order, items: orderItems };
  }

  async listOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db.select().from(orders);
    const allItems = await db.select().from(items);

    return allOrders.map(order => ({
      ...order,
      items: allItems.filter(item => item.orderId === order.orderId),
    }));
  }

  async updateOrder(orderId: string, orderInput: OrderInput): Promise<OrderWithItems> {
    const [updatedOrder] = await db.update(orders)
      .set({
        value: orderInput.valorTotal,
        creationDate: new Date(orderInput.dataCriacao),
      })
      .where(eq(orders.orderId, orderId))
      .returning();

    if (!updatedOrder) {
        throw new Error("Order not found during update");
    }

    // Recreate items for simplicity (delete old, insert new)
    await db.delete(items).where(eq(items.orderId, orderId));
    
    let newItems: typeof items.$inferSelect[] = [];
    if (orderInput.items && orderInput.items.length > 0) {
      newItems = await db.insert(items).values(
        orderInput.items.map(item => ({
          orderId: updatedOrder.orderId,
          productId: item.idItem,
          quantity: item.quantidadeItem,
          price: item.valorItem,
        }))
      ).returning();
    }

    return { ...updatedOrder, items: newItems };
  }

  async deleteOrder(orderId: string): Promise<void> {
    await db.delete(items).where(eq(items.orderId, orderId));
    await db.delete(orders).where(eq(orders.orderId, orderId));
  }
}

export const storage = new DatabaseStorage();
