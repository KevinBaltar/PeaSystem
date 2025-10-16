import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';
import { Produto, Categoria } from '../../types/shopping';
import { toast } from 'sonner';

interface AddProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduto: (produto: Produto) => void;
  categorias: Categoria[];
}

const UNIDADES = ['un', 'kg', 'g', 'L', 'ml', 'cx', 'pct'];

export function AddProdutoDialog({ open, onOpenChange, onAddProduto, categorias }: AddProdutoDialogProps) {
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [unidade, setUnidade] = useState('un');
  const [precoInicial, setPrecoInicial] = useState('');
  const [marca, setMarca] = useState('');
  const [quantidadePadrao, setQuantidadePadrao] = useState('1');

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast.error('Digite um nome para o produto');
      return;
    }

    if (!categoriaId) {
      toast.error('Selecione uma categoria');
      return;
    }

    const precos = [];
    if (precoInicial) {
      const valor = parseFloat(precoInicial);
      if (!isNaN(valor) && valor > 0) {
        precos.push({
          id: Date.now().toString(),
          valor,
          data: new Date().toISOString(),
        });
      }
    }

    const qtdPadrao = parseFloat(quantidadePadrao);
    if (isNaN(qtdPadrao) || qtdPadrao <= 0) {
      toast.error('Quantidade padrão inválida');
      return;
    }

    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: nome.trim(),
      categoriaId,
      unidade,
      precos,
      marca: marca.trim() || undefined,
      quantidadePadrao: qtdPadrao,
    };

    onAddProduto(novoProduto);
    setNome('');
    setCategoriaId('');
    setUnidade('un');
    setPrecoInicial('');
    setMarca('');
    setQuantidadePadrao('1');
    onOpenChange(false);
    toast.success('Produto criado');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Cadastre um novo produto para suas listas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome do Produto</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Arroz"
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.cor }}
                      />
                      {cat.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Marca (opcional)</Label>
            <Input
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Ex: Tio João"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Qtd. Padrão</Label>
              <Input
                type="number"
                value={quantidadePadrao}
                onChange={(e) => setQuantidadePadrao(e.target.value)}
                placeholder="1"
                min="0.01"
                step="0.01"
              />
            </div>

            <div>
              <Label>Unidade</Label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES.map(u => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Preço Inicial (opcional)</Label>
            <Input
              type="number"
              value={precoInicial}
              onChange={(e) => setPrecoInicial(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}