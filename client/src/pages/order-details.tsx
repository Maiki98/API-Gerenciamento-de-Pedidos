import { useOrder } from "@/hooks/use-orders";
import { Link, useParams } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, FileText, Package, DollarSign, Loader2 } from "lucide-react";

export function OrderDetails() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id || null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Carregando detalhes do pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-8">O pedido que você está procurando não existe ou foi deletado.</p>
        <Link href="/">
          <span className="text-primary hover:underline font-medium cursor-pointer">Voltar para o Dashboard</span>
        </Link>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Pedidos
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden border border-border/60 shadow-xl shadow-black/5">
        
        {/* Cabeçalho */}
        <div className="bg-zinc-50 border-b border-border/60 px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider uppercase">Nota Fiscal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                {order.orderId}
              </h1>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(order.value)}</p>
            </div>
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="px-8 py-6 border-b border-border/40 flex flex-wrap gap-12 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">Data</p>
              <p className="font-medium text-sm">{format(new Date(order.creationDate), "dd 'de' MMMM 'de' yyyy", { locale: require('date-fns/locale/pt-BR').default })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">Itens</p>
              <p className="font-medium text-sm">{order.items?.length || 0} produto(s)</p>
            </div>
          </div>
        </div>

        {/* Itens da Nota */}
        <div className="p-8">
          <h3 className="font-semibold text-lg mb-6">Itens</h3>
          
          {(!order.items || order.items.length === 0) ? (
            <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Nenhum item registrado para este pedido.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border/60">
                    <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Produto</th>
                    <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Preço Unit.</th>
                    <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Quantidade</th>
                    <th className="pb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 font-medium">{item.productId}</td>
                      <td className="py-4 text-right text-muted-foreground">{formatCurrency(item.price)}</td>
                      <td className="py-4 text-right font-medium">{item.quantity}</td>
                      <td className="py-4 text-right font-semibold text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-6 text-right font-semibold text-muted-foreground">Subtotal</td>
                    <td className="py-6 text-right font-bold text-lg">{formatCurrency(order.value)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        {/* Rodapé com Ações */}
        <div className="bg-zinc-50 px-8 py-6 border-t border-border flex justify-end">
          <Link 
            href={`/orders/${order.orderId}/edit`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-white border border-border shadow-sm hover:shadow-md hover:bg-zinc-50 transition-all"
          >
            Editar Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
