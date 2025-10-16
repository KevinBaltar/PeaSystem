import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Lista, Produto, Categoria, ItemLista } from '../../types/shopping';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReusarListaDialog } from './ReusarListaDialog';

interface ListaDetailProps {
  lista: Lista;
  produtos: Produto[];
  categorias: Categoria[];
  onBack: () => void;
  onUpdateLista: (lista: Lista) => void;
  onDeleteLista: (id: string) => void;
  onUpdateProduto: (produto: Produto) => void;
  onSelectProduto?: (produto: Produto) => void;
  onReuseLista: (listaOriginal: Lista, novoNome: string) => void;
}

export function ListaDetail({ lista, produtos, categorias, onBack, onUpdateLista, onDeleteLista, onUpdateProduto, onSelectProduto, onReuseLista }: ListaDetailProps) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReusarDialog, setShowReusarDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPreco, setEditPreco] = useState('');

  const getCategoria = (categoriaId: string) => {
    return categorias.find(c => c.id === categoriaId);
  };

  const getProduto = (produtoId: string) => {
    return produtos.find(p => p.id === produtoId);
  };

  const toggleItemComprado = (itemId: string) => {
    const updatedItens = lista.itens.map(item =>
      item.id === itemId ? { ...item, comprado: !item.comprado } : item
    );
    onUpdateLista({ ...lista, itens: updatedItens });
  };

  const removeItem = (itemId: string) => {
    const updatedItens = lista.itens.filter(item => item.id !== itemId);
    onUpdateLista({ ...lista, itens: updatedItens });
    toast.success('Item removido');
  };

  const addItem = () => {
    if (!selectedProdutoId) {
      toast.error('Selecione um produto');
      return;
    }

    const qtd = parseFloat(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      toast.error('Quantidade inválida');
      return;
    }

    const novoItem: ItemLista = {
      id: Date.now().toString(),
      produtoId: selectedProdutoId,
      quantidade: qtd,
      comprado: false,
    };

    onUpdateLista({ ...lista, itens: [...lista.itens, novoItem] });
    setShowAddItem(false);
    setSelectedProdutoId('');
    setQuantidade('1');
    toast.success('Item adicionado');
  };

  const handleProdutoSelect = (produtoId: string) => {
    setSelectedProdutoId(produtoId);
    const produto = getProduto(produtoId);
    if (produto?.quantidadePadrao) {
      setQuantidade(produto.quantidadePadrao.toString());
    }
  };

  const toggleConcluida = () => {
    if (!lista.concluida) {
      // Concluindo a lista - salvar preços no histórico dos produtos
      const itensComprados = lista.itens.filter(item => item.comprado && item.precoCompra);
      
      itensComprados.forEach(item => {
        const produto = getProduto(item.produtoId);
        if (produto && item.precoCompra) {
          const novoPreco = {
            id: Date.now().toString() + Math.random(),
            valor: item.precoCompra,
            data: new Date().toISOString(),
            local: 'Compra da lista: ' + lista.nome,
          };
          
          onUpdateProduto({
            ...produto,
            precos: [...produto.precos, novoPreco],
          });
        }
      });

      const totalGasto = lista.itens
        .filter(item => item.comprado)
        .reduce((sum, item) => {
          return sum + (item.precoCompra || 0) * item.quantidade;
        }, 0);

      onUpdateLista({ 
        ...lista, 
        concluida: true,
        dataConclusao: new Date().toISOString(),
        totalGasto,
      });
      toast.success('Lista concluída e preços salvos no histórico');
    } else {
      // Reabrindo a lista
      onUpdateLista({ ...lista, concluida: false });
      toast.success('Lista reaberta');
    }
  };

  const updateItemPreco = (itemId: string, novoPreco: number) => {
    const updatedItens = lista.itens.map(item =>
      item.id === itemId ? { ...item, precoCompra: novoPreco } : item
    );
    onUpdateLista({ ...lista, itens: updatedItens });
    setEditingItemId(null);
    setEditPreco('');
    toast.success('Preço atualizado');
  };

  const startEditPreco = (item: ItemLista) => {
    setEditingItemId(item.id);
    const produto = getProduto(item.produtoId);
    const precoAtual = item.precoCompra || (produto?.precos.length ? produto.precos[produto.precos.length - 1].valor : 0);
    setEditPreco(precoAtual.toString());
  };

  const deleteLista = () => {
    onDeleteLista(lista.id);
    onBack();
    toast.success('Lista excluída');
  };

  const produtosDisponiveis = produtos.filter(
    p => !lista.itens.some(item => item.produtoId === p.id)
  );

  const itensNaoComprados = lista.itens.filter(item => !item.comprado);
  const itensComprados = lista.itens.filter(item => item.comprado);

  const renderItem = (item: ItemLista) => {
    const produto = getProduto(item.produtoId);
    if (!produto) return null;

    const categoria = getCategoria(produto.categoriaId);
    const precoReferencia = produto.precos.length > 0
      ? produto.precos[produto.precos.length - 1].valor
      : 0;
    const precoAtual = item.precoCompra || precoReferencia;
    const total = precoAtual * item.quantidade;

    const isEditing = editingItemId === item.id;

    return (
      <Card
        key={item.id}
        className={`p-4 ${item.comprado ? 'bg-accent/30' : ''}`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={item.comprado}
            onCheckedChange={() => toggleItemComprado(item.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div 
              className="flex items-center gap-2 mb-1 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => onSelectProduto && onSelectProduto(produto)}
            >
              {categoria && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoria.cor }}
                />
              )}
              <h4 className={item.comprado ? 'line-through text-muted-foreground' : ''}>
                {produto.nome}
              </h4>
              {produto.marca && (
                <Badge variant="outline" className="text-xs">
                  {produto.marca}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge variant="secondary">
                {item.quantidade} {produto.unidade}
              </Badge>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={editPreco}
                  onChange={(e) => setEditPreco(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-24"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const valor = parseFloat(editPreco);
                    if (!isNaN(valor) && valor > 0) {
                      updateItemPreco(item.id, valor);
                    }
                  }}
                >
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingItemId(null);
                    setEditPreco('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge 
                  variant={item.precoCompra ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => !lista.concluida && startEditPreco(item)}
                >
                  R$ {precoAtual.toFixed(2)}
                  {!lista.concluida && <Edit2 className="w-3 h-3 ml-1" />}
                </Badge>
                {total > precoAtual && (
                  <span className="text-sm text-muted-foreground">
                    Total: R$ {total.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            disabled={lista.concluida}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  };

  const totalEstimado = lista.itens.reduce((sum, item) => {
    const produto = getProduto(item.produtoId);
    const precoReferencia = produto?.precos.length ? produto.precos[produto.precos.length - 1].valor : 0;
    const precoAtual = item.precoCompra || precoReferencia;
    return sum + (precoAtual * item.quantidade);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-background z-10 border-b">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="truncate">{lista.nome}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date(lista.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={lista.concluida ? 'outline' : 'default'}
              className="flex-1"
              onClick={toggleConcluida}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {lista.concluida ? 'Reabrir' : 'Concluir'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {totalEstimado > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {lista.concluida ? 'Total gasto' : 'Total estimado'}
              </p>
              <p>R$ {totalEstimado.toFixed(2)}</p>
            </div>
          )}
          
          {lista.concluida && lista.dataConclusao && (
            <div className="mt-3 text-center">
              <Badge variant="secondary">
                Concluída em {new Date(lista.dataConclusao).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24">
        {lista.itens.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              Adicione produtos à lista
            </p>
            <Button onClick={() => setShowAddItem(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {itensNaoComprados.length > 0 && (
              <div>
                <h3 className="mb-3">
                  A Comprar ({itensNaoComprados.length})
                </h3>
                <div className="space-y-3">
                  {itensNaoComprados.map(renderItem)}
                </div>
              </div>
            )}

            {itensComprados.length > 0 && (
              <div>
                <h3 className="mb-3">
                  Comprados ({itensComprados.length})
                </h3>
                <div className="space-y-3">
                  {itensComprados.map(renderItem)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {lista.itens.length > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => setShowAddItem(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      )}

      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
            <DialogDescription>
              Adicione um produto à lista
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Produto</Label>
              <Select value={selectedProdutoId} onValueChange={handleProdutoSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtosDisponiveis.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome} {produto.marca ? `- ${produto.marca}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="1"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItem(false)}>
              Cancelar
            </Button>
            <Button onClick={addItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Lista</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta lista?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteLista}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReusarListaDialog
        open={showReusarDialog}
        onOpenChange={setShowReusarDialog}
        lista={lista}
        onReuseLista={onReuseLista}
      />
    </div>
  );
}