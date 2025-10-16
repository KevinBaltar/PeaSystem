import { Receipt, Copy } from 'lucide-react';
import { useState } from 'react';
import { Lista } from '../../types/shopping';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ReusarListaDialog } from './ReusarListaDialog';

interface HistoricoTabProps {
  listas: Lista[];
  onSelectLista: (lista: Lista) => void;
  onReuseLista: (listaOriginal: Lista, novoNome: string) => void;
}

export function HistoricoTab({ listas, onSelectLista, onReuseLista }: HistoricoTabProps) {
  const [showReusarDialog, setShowReusarDialog] = useState(false);
  const [listaParaReusar, setListaParaReusar] = useState<Lista | null>(null);
  
  const listasConcluidas = listas
    .filter(l => l.concluida)
    .sort((a, b) => {
      const dateA = a.dataConclusao ? new Date(a.dataConclusao).getTime() : 0;
      const dateB = b.dataConclusao ? new Date(b.dataConclusao).getTime() : 0;
      return dateB - dateA;
    });

  // Estatísticas
  const totalCompras = listasConcluidas.length;
  const totalGastoGeral = listasConcluidas.reduce((sum, lista) => sum + (lista.totalGasto || 0), 0);
  const mediaGasto = totalCompras > 0 ? totalGastoGeral / totalCompras : 0;

  // Agrupar por mês
  const comprasPorMes = listasConcluidas.reduce((acc, lista) => {
    if (lista.dataConclusao) {
      const data = new Date(lista.dataConclusao);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      if (!acc[mesAno]) {
        acc[mesAno] = [];
      }
      acc[mesAno].push(lista);
    }
    return acc;
  }, {} as Record<string, Lista[]>);

  const handleReusar = (lista: Lista, e: React.MouseEvent) => {
    e.stopPropagation();
    setListaParaReusar(lista);
    setShowReusarDialog(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 pb-24">
        {listasConcluidas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Receipt className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">Nenhuma compra concluída</h3>
            <p className="text-muted-foreground">
              Conclua suas listas para ver o histórico
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p>{totalCompras}</p>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-muted-foreground mb-1">Gasto</p>
                <p>R$ {totalGastoGeral.toFixed(2)}</p>
              </Card>
              <Card className="p-3">
                <p className="text-sm text-muted-foreground mb-1">Média</p>
                <p>R$ {mediaGasto.toFixed(2)}</p>
              </Card>
            </div>

            {/* Histórico por mês */}
            {Object.entries(comprasPorMes).map(([mesAno, listas]) => {
              const [mes, ano] = mesAno.split('/');
              const nomeMes = new Date(parseInt(ano), parseInt(mes) - 1).toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              });
              const totalMes = listas.reduce((sum, l) => sum + (l.totalGasto || 0), 0);

              return (
                <div key={mesAno}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="capitalize">{nomeMes}</h3>
                    <Badge variant="outline">R$ {totalMes.toFixed(2)}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {listas.map(lista => {
                      const itensComprados = lista.itens.filter(i => i.comprado).length;
                      
                      return (
                        <Card
                          key={lista.id}
                          className="p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div 
                            className="cursor-pointer"
                            onClick={() => onSelectLista(lista)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="truncate mb-2">{lista.nome}</h4>
                                
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="secondary">
                                    {itensComprados} {itensComprados === 1 ? 'item' : 'itens'}
                                  </Badge>
                                  {lista.totalGasto && lista.totalGasto > 0 && (
                                    <Badge variant="outline">
                                      R$ {lista.totalGasto.toFixed(2)}
                                    </Badge>
                                  )}
                                </div>

                                {lista.dataConclusao && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {new Date(lista.dataConclusao).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={(e) => handleReusar(lista, e)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Reaproveitar Lista
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReusarListaDialog
        open={showReusarDialog}
        onOpenChange={setShowReusarDialog}
        lista={listaParaReusar}
        onReuseLista={onReuseLista}
      />
    </div>
  );
}