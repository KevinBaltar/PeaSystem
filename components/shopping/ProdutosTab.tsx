import { Plus, Package, TrendingUp, TrendingDown, Share2, Download } from 'lucide-react';
import { Produto, Categoria } from '../../types/shopping';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';

interface ProdutosTabProps {
  produtos: Produto[];
  categorias: Categoria[];
  onAddProduto: () => void;
  onSelectProduto: (produto: Produto) => void;
  onShareProdutos: () => void;
  onImportProdutos: () => void;
}

export function ProdutosTab({ 
  produtos, 
  categorias, 
  onAddProduto, 
  onSelectProduto, 
  onShareProdutos, 
  onImportProdutos 
}: ProdutosTabProps) {
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all');

  const produtosFiltrados = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) ||
                        (p.marca && p.marca.toLowerCase().includes(search.toLowerCase()));
    const matchCategoria = categoriaFilter === 'all' || p.categoriaId === categoriaFilter;
    return matchSearch && matchCategoria;
  });

  const getCategoria = (categoriaId: string) => {
    return categorias.find(c => c.id === categoriaId);
  };

  const getPrecoTrend = (produto: Produto) => {
    if (produto.precos.length < 2) return null;
    const ultimoPreco = produto.precos[produto.precos.length - 1].valor;
    const penultimoPreco = produto.precos[produto.precos.length - 2].valor;
    const diff = ultimoPreco - penultimoPreco;
    const percentual = ((diff / penultimoPreco) * 100).toFixed(1);
    return { diff, percentual, aumento: diff > 0 };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-background z-10 p-4 border-b space-y-3">
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImportProdutos}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShareProdutos}
              disabled={produtos.length === 0}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <Button
              variant={categoriaFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoriaFilter('all')}
            >
              Todas
            </Button>
            {categorias.map(cat => (
              <Button
                key={cat.id}
                variant={categoriaFilter === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoriaFilter(cat.id)}
                className="whitespace-nowrap"
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: cat.cor }}
                />
                {cat.nome}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 pb-24">
          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="mb-2">Nenhum produto cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre produtos ou importe de outros usuários
              </p>
              <div className="flex gap-2">
                <Button onClick={onAddProduto}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
                <Button variant="outline" onClick={onImportProdutos}>
                  <Download className="w-4 h-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {produtosFiltrados.map(produto => {
                const categoria = getCategoria(produto.categoriaId);
                const trend = getPrecoTrend(produto);
                const ultimoPreco = produto.precos.length > 0
                  ? produto.precos[produto.precos.length - 1]
                  : null;

                return (
                  <Card
                    key={produto.id}
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onSelectProduto(produto)}
                  >
                    <div className="flex items-start gap-3">
                      {produto.foto && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <ImageWithFallback
                            src={produto.foto}
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {categoria && (
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: categoria.cor }}
                            />
                          )}
                          <h3 className="truncate">{produto.nome}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {categoria && (
                            <Badge variant="secondary">{categoria.nome}</Badge>
                          )}
                          {produto.marca && (
                            <Badge variant="outline">{produto.marca}</Badge>
                          )}
                          <Badge variant="outline">{produto.unidade}</Badge>
                        </div>

                        {ultimoPreco && (
                          <div className="mt-2">
                            <p className="text-muted-foreground">
                              R$ {ultimoPreco.valor.toFixed(2)}
                            </p>
                            {trend && (
                              <div className={`flex items-center gap-1 mt-1 ${trend.aumento ? 'text-red-600' : 'text-green-600'}`}>
                                {trend.aumento ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span className="text-sm">
                                  {trend.aumento ? '+' : ''}{trend.percentual}%
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {produtos.length > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={onAddProduto}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
