import { ArrowLeft, Plus, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { Produto, Categoria, PrecoHistorico } from '../../types/shopping';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProdutoDetailProps {
  produto: Produto;
  categoria: Categoria | undefined;
  onBack: () => void;
  onUpdateProduto: (produto: Produto) => void;
  onDeleteProduto: (id: string) => void;
}

export function ProdutoDetail({ produto, categoria, onBack, onUpdateProduto, onDeleteProduto }: ProdutoDetailProps) {
  const [showAddPreco, setShowAddPreco] = useState(false);
  const [novoPreco, setNovoPreco] = useState('');
  const [localCompra, setLocalCompra] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editNome, setEditNome] = useState(produto.nome);
  const [editMarca, setEditMarca] = useState(produto.marca || '');
  const [editQuantidadePadrao, setEditQuantidadePadrao] = useState(produto.quantidadePadrao?.toString() || '1');
  const [editUnidade, setEditUnidade] = useState(produto.unidade);
  const [editFotoUrl, setEditFotoUrl] = useState(produto.foto || '');

  const addPreco = () => {
    const valor = parseFloat(novoPreco);
    if (isNaN(valor) || valor <= 0) {
      toast.error('Preço inválido');
      return;
    }

    const novoHistorico: PrecoHistorico = {
      id: Date.now().toString(),
      valor,
      data: new Date().toISOString(),
      local: localCompra || undefined,
    };

    onUpdateProduto({
      ...produto,
      precos: [...produto.precos, novoHistorico],
    });

    setShowAddPreco(false);
    setNovoPreco('');
    setLocalCompra('');
    toast.success('Preço adicionado');
  };

  const removePreco = (precoId: string) => {
    onUpdateProduto({
      ...produto,
      precos: produto.precos.filter(p => p.id !== precoId),
    });
    toast.success('Preço removido');
  };

  const deleteProduto = () => {
    onDeleteProduto(produto.id);
    onBack();
    toast.success('Produto excluído');
  };

  const updateProduto = () => {
    if (!editNome.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }

    const qtdPadrao = parseFloat(editQuantidadePadrao);
    if (isNaN(qtdPadrao) || qtdPadrao <= 0) {
      toast.error('Quantidade padrão inválida');
      return;
    }

    onUpdateProduto({
      ...produto,
      nome: editNome,
      marca: editMarca || undefined,
      quantidadePadrao: qtdPadrao,
      unidade: editUnidade,
      foto: editFotoUrl || undefined,
    });

    setShowEditDialog(false);
    toast.success('Produto atualizado');
  };

  const getPrecoTrend = () => {
    if (produto.precos.length < 2) return null;
    const ultimoPreco = produto.precos[produto.precos.length - 1].valor;
    const penultimoPreco = produto.precos[produto.precos.length - 2].valor;
    const diff = ultimoPreco - penultimoPreco;
    const percentual = ((diff / penultimoPreco) * 100).toFixed(1);
    return { diff, percentual, aumento: diff > 0 };
  };

  const getPrecoMedio = () => {
    if (produto.precos.length === 0) return 0;
    const soma = produto.precos.reduce((acc, p) => acc + p.valor, 0);
    return soma / produto.precos.length;
  };

  const getPrecoMinMax = () => {
    if (produto.precos.length === 0) return { min: 0, max: 0 };
    const valores = produto.precos.map(p => p.valor);
    return {
      min: Math.min(...valores),
      max: Math.max(...valores),
    };
  };

  const trend = getPrecoTrend();
  const precoMedio = getPrecoMedio();
  const { min, max } = getPrecoMinMax();

  const chartData = produto.precos.map(p => ({
    data: new Date(p.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    preco: p.valor,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-background z-10 border-b p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {categoria && (
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoria.cor }}
                />
              )}
              <h2 className="truncate">{produto.nome}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categoria && (
                <Badge variant="secondary">{categoria.nome}</Badge>
              )}
              {produto.marca && (
                <Badge variant="outline">{produto.marca}</Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Foto do produto */}
        {produto.foto && (
          <div className="mb-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <ImageWithFallback
                src={produto.foto}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {produto.precos.length > 0 && (
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Último Preço</p>
                <p>
                  R$ {produto.precos[produto.precos.length - 1].valor.toFixed(2)}
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

              <div>
                <p className="text-sm text-muted-foreground">Preço Médio</p>
                <p>R$ {precoMedio.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Menor Preço</p>
                <p className="text-green-600">R$ {min.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Maior Preço</p>
                <p className="text-red-600">R$ {max.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24">
        {produto.precos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              Nenhum preço cadastrado
            </p>
            <Button onClick={() => setShowAddPreco(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Preço
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {chartData.length > 1 && (
              <Card className="p-4">
                <h3 className="mb-4">Evolução de Preços</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="preco"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            <div>
              <h3 className="mb-3">Histórico de Preços</h3>
              <div className="space-y-3">
                {[...produto.precos].reverse().map(preco => (
                  <Card key={preco.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>
                          R$ {preco.valor.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(preco.data).toLocaleDateString('pt-BR')}
                        </p>
                        {preco.local && (
                          <Badge variant="outline" className="mt-1">
                            {preco.local}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePreco(preco.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4 z-10">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setShowAddPreco(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <Dialog open={showAddPreco} onOpenChange={setShowAddPreco}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Preço</DialogTitle>
            <DialogDescription>
              Registre um novo preço para este produto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
            </div>

            <div>
              <Label>Local (opcional)</Label>
              <Input
                value={localCompra}
                onChange={(e) => setLocalCompra(e.target.value)}
                placeholder="Ex: Supermercado X"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPreco(false)}>
              Cancelar
            </Button>
            <Button onClick={addPreco}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Edite as informações do produto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <Label>Marca (opcional)</Label>
              <Input
                value={editMarca}
                onChange={(e) => setEditMarca(e.target.value)}
                placeholder="Marca do produto"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Quantidade Padrão</Label>
                <Input
                  type="number"
                  value={editQuantidadePadrao}
                  onChange={(e) => setEditQuantidadePadrao(e.target.value)}
                  placeholder="1"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div>
                <Label>Unidade</Label>
                <Input
                  value={editUnidade}
                  onChange={(e) => setEditUnidade(e.target.value)}
                  placeholder="un, kg, l"
                />
              </div>
            </div>

            <div>
              <Label>URL da Foto (opcional)</Label>
              <Input
                value={editFotoUrl}
                onChange={(e) => setEditFotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
              />
              {editFotoUrl && (
                <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={editFotoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={updateProduto}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteProduto}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}