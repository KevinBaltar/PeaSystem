import { Plus, Tag, Edit2, Trash2 } from 'lucide-react';
import { Categoria, Produto } from '../../types/shopping';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface CategoriasTabProps {
  categorias: Categoria[];
  produtos: Produto[];
  onAddCategoria: () => void;
  onEditCategoria: (categoria: Categoria) => void;
  onDeleteCategoria: (id: string) => void;
}

export function CategoriasTab({
  categorias,
  produtos,
  onAddCategoria,
  onEditCategoria,
  onDeleteCategoria,
}: CategoriasTabProps) {
  const getProdutosCount = (categoriaId: string) => {
    return produtos.filter(p => p.categoriaId === categoriaId).length;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 pb-24">
        {categorias.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Tag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">Nenhuma categoria criada</h3>
            <p className="text-muted-foreground mb-6">
              Crie categorias para organizar seus produtos
            </p>
            <Button onClick={onAddCategoria}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {categorias.map(categoria => {
              const produtosCount = getProdutosCount(categoria.id);

              return (
                <Card key={categoria.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate">{categoria.nome}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {produtosCount} {produtosCount === 1 ? 'produto' : 'produtos'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditCategoria(categoria)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteCategoria(categoria.id)}
                        disabled={produtosCount > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4 z-10">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={onAddCategoria}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}