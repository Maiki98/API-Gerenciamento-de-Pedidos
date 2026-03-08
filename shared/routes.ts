import { z } from "zod";
import { orderInputSchema } from "./schema";

// Esquemas de erro compartilhados
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const itemResponseSchema = z.object({
  id: z.number(),
  orderId: z.string(),
  productId: z.number(),
  quantity: z.number(),
  price: z.number(),
});

const orderResponseSchema = z.object({
  orderId: z.string(),
  value: z.number(),
  creationDate: z.date().or(z.string()),
  items: z.array(itemResponseSchema).optional(),
});

// Contrato de API - Define rotas, métodos e esquemas de requisição/resposta
export const api = {
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/order' as const,
      input: orderInputSchema,
      responses: {
        201: orderResponseSchema,
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/order/:orderId' as const,
      responses: {
        200: orderResponseSchema,
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/order/list' as const,
      responses: {
        200: z.array(orderResponseSchema),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/order/:orderId' as const,
      input: orderInputSchema,
      responses: {
        200: orderResponseSchema,
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/order/:orderId' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type ItemResponse = z.infer<typeof itemResponseSchema>;
