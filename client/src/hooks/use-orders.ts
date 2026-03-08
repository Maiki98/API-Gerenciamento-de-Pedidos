import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type OrderResponse } from "@shared/routes";
import type { OrderInput } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await fetch(api.orders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return api.orders.list.responses[200].parse(await res.json());
    },
  });
}

export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: [api.orders.get.path, orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const url = buildUrl(api.orders.get.path, { orderId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch order details");
      return api.orders.get.responses[200].parse(await res.json());
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: OrderInput) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      toast({
        title: "Pedido criado",
        description: "Seu novo pedido foi criado com sucesso.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Falha na criação",
        description: error.message,
      });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: OrderInput }) => {
      const url = buildUrl(api.orders.update.path, { orderId });
      const res = await fetch(url, {
        method: api.orders.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update order");
      }
      return api.orders.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.orders.get.path, data.orderId] });
      toast({
        title: "Pedido atualizado",
        description: "O pedido foi atualizado com sucesso.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Falha na atualização",
        description: error.message,
      });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const url = buildUrl(api.orders.delete.path, { orderId });
      const res = await fetch(url, {
        method: api.orders.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete order");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      toast({
        title: "Pedido deletado",
        description: "O pedido foi removido permanentemente.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Falha na exclusão",
        description: error.message,
      });
    },
  });
}
