import { Plus, ShoppingBag, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { Lista, Produto } from '../../types/shopping';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ReusarListaDialog } from './ReusarListaDialog';

interface ListasTabProps {
  listas: Lista[];
  produtos: Produto[];
  onAddLista: () => void;
  onSelectLista: (lista: Lista) => void;
  onDeleteLista: (id: string) => void;
  onReuseLista: (listaOriginal: Lista, novoNome: string) => void;
}

export function ListasTab({ listas, produtos, onAddLista, onSelectLista, onReuseLista }: ListasTabProps) {
  const [showReusarDialog, setShowReusarDialog] = useState(false);
  const [listaParaReusar] = useState<Lista | null>(null);
  
  const listasAtivas = listas.filter(l => !l.concluida);
  const listasConcluidas = listas.filter(l => l.concluida);

  const getListaProgress = (lista: Lista) => {
    if (lista.itens.length === 0) return { comprados: 0, total: 0, percentual: 0 };
    const comprados = lista.itens.filter(i => i.comprado).length;
    const total = lista.itens.length;
    const percentual = Math.round((comprados / total) * 100);
    return { comprados, total, percentual };
  };

  const getListaTotal = (lista: Lista) => {
    return lista.itens.reduce((sum, item) => {
      if (item.precoCompra) {
        return sum + (item.precoCompra * item.quantidade);
      }
      const produto = produtos.find(p => p.id === item.produtoId);
      if (produto && produto.precos.length > 0) {
        const ultimoPreco = produto.precos[produto.precos.length - 1].valor;
        return sum + (ultimoPreco * item.quantidade);
      }
      return sum;
    }, 0);
  };

  const renderLista = (lista: Lista) => {
    const progress = getListaProgress(lista);
    const total = getListaTotal(lista);

    return (
      <Card
        key={lista.id}
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onSelectLista(lista)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {lista.concluida ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <h3 className="truncate">{lista.nome}</h3>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">
                {progress.comprados}/{progress.total} itens
              </Badge>
              {total > 0 && (
                <Badge variant="outline">
                  R$ {total.toFixed(2)}
                </Badge>
              )}
            </div>

            {!lista.concluida && progress.total > 0 && (
              <div className="mt-3">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress.percentual}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{progress.percentual}% concluído</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-2">
              {new Date(lista.dataCriacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 pb-24">
        {listas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">Nenhuma lista criada</h3>
            <p className="text-muted-foreground mb-6">
              Crie sua primeira lista de compras
            </p>
            <Button onClick={onAddLista}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Lista
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {listasAtivas.length > 0 && (
              <div>
                <h2 className="mb-3">Listas Ativas</h2>
                <div className="space-y-3">
                  {listasAtivas.map(renderLista)}
                </div>
              </div>
            )}

            {listasConcluidas.length > 0 && (
              <div>
                <h2 className="mb-3">Concluídas</h2>
                <div className="space-y-3">
                  {listasConcluidas.map(renderLista)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {listas.length > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={onAddLista}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}

      <ReusarListaDialog
        open={showReusarDialog}
        onOpenChange={setShowReusarDialog}
        lista={listaParaReusar}
        onReuseLista={onReuseLista}
      />
    </div>
  );
}