import { useState, useEffect } from 'react';
import { Lista } from '../../types/shopping';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ReusarListaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lista: Lista | null;
  onReuseLista: (listaOriginal: Lista, novoNome: string) => void;
}

export function ReusarListaDialog({ open, onOpenChange, lista, onReuseLista }: ReusarListaDialogProps) {
  const [novoNome, setNovoNome] = useState('');

  useEffect(() => {
    if (lista) {
      const hoje = new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      setNovoNome(`${lista.nome} - ${hoje}`);
    }
  }, [lista]);

  const handleSubmit = () => {
    if (!lista || !novoNome.trim()) return;
    onReuseLista(lista, novoNome.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reaproveitar Lista</DialogTitle>
          <DialogDescription>
            Uma nova lista será criada com os mesmos itens. Você poderá editar os preços e quantidades.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome da nova lista</Label>
            <Input
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Ex: Compras de Outubro"
            />
          </div>

          {lista && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Lista original</p>
              <p>{lista.nome}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {lista.itens.length} {lista.itens.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!novoNome.trim()}>
            Criar Lista
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}