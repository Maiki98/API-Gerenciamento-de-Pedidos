import { useOrder, useCreateOrder, useUpdateOrder } from "@/hooks/use-orders";
import { Link, useParams } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderInputSchema, type OrderInput } from "@shared/schema";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

export function OrderForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const { data: existingOrder, isLoading: isFetching } = useOrder(id || null);
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const form = useForm<OrderInput>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: {
      numeroPedido: "",
      valorTotal: 0,
      dataCriacao: new Date().toISOString().slice(0, 16),
      items: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Watch items to auto-calculate total
  const watchedItems = form.watch("items");
  const computedTotal = useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.quantidadeItem * item.valorItem || 0), 0);
  }, [watchedItems]);

  // Set the total whenever items change
  useEffect(() => {
    if (watchedItems.length > 0) {
      form.setValue("valorTotal", computedTotal, { shouldValidate: true });
    }
  }, [computedTotal, form, watchedItems.length]);

  useEffect(() => {
    if (existingOrder && isEditMode) {
      form.reset({
        numeroPedido: existingOrder.orderId,
        valorTotal: existingOrder.value,
        dataCriacao: new Date(existingOrder.creationDate).toISOString().slice(0, 16),
        items: existingOrder.items?.map(i => ({
          idItem: i.productId,
          quantidadeItem: i.quantity,
          valorItem: i.price
        })) || []
      });
    }
  }, [existingOrder, isEditMode, form]);

  const onSubmit = (data: OrderInput) => {
    if (isEditMode && id) {
      updateOrder.mutate({ orderId: id, data });
    } else {
      createOrder.mutate(data);
    }
  };

  const isPending = createOrder.isPending || updateOrder.isPending;

  if (isEditMode && isFetching) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Pedidos
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border/60 shadow-xl shadow-black/5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">
            {isEditMode ? "Editar Pedido" : "Criar Novo Pedido"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os detalhes abaixo. Os campos obrigatórios são marcados com um asterisco.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Seção de Informações Gerais */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">Informações Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">ID do Pedido *</label>
                <input
                  {...form.register("numeroPedido")}
                  disabled={isEditMode}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-border focus-ring disabled:opacity-50"
                  placeholder="ex.: ORD-2023-001"
                />
                {form.formState.errors.numeroPedido && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.numeroPedido.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data de Criação *</label>
                <input
                  type="datetime-local"
                  {...form.register("dataCriacao")}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-border focus-ring"
                />
                {form.formState.errors.dataCriacao && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.dataCriacao.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Valor Total *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    {...form.register("valorTotal", { valueAsNumber: true })}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-50 border border-border focus-ring"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Calculado automaticamente a partir dos itens, mas pode ser substituído.</p>
                {form.formState.errors.valorTotal && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.valorTotal.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Itens */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Itens do Pedido</h2>
              <button
                type="button"
                onClick={() => append({ idItem: "", quantidadeItem: 1, valorItem: 0 })}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" /> Adicionar Item
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground text-sm">Nenhum item adicionado ainda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 items-start bg-zinc-50 p-4 rounded-xl border border-border">
                    <div className="col-span-12 md:col-span-4 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">ID do Produto</label>
                      <input
                        {...form.register(`items.${index}.idItem`)}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-border focus-ring"
                        placeholder="ex.: 1001"
                      />
                      {form.formState.errors.items?.[index]?.idItem && (
                        <p className="text-destructive text-xs mt-1">{form.formState.errors.items[index]?.idItem?.message}</p>
                      )}
                    </div>
                    
                    <div className="col-span-6 md:col-span-3 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Quantidade</label>
                      <input
                        type="number"
                        {...form.register(`items.${index}.quantidadeItem`, { valueAsNumber: true })}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-border focus-ring"
                        min="1"
                      />
                    </div>
                    
                    <div className="col-span-6 md:col-span-4 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Preço Unitário</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          {...form.register(`items.${index}.valorItem`, { valueAsNumber: true })}
                          className="w-full pl-6 pr-3 py-2 text-sm rounded-lg bg-white border border-border focus-ring"
                        />
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-1 flex items-end justify-end md:pb-2 pt-2 md:pt-6">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
               <p className="text-destructive text-sm mt-1">{form.formState.errors.items.message}</p>
            )}
          </div>

          <div className="pt-6 border-t flex items-center justify-end gap-4">
            <Link href="/">
              <button type="button" className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEditMode ? "Salvar Alterações" : "Criar Pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
