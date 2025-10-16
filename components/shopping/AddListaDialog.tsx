import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Lista } from '../../types/shopping';
import { toast } from 'sonner';

interface AddListaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLista: (lista: Lista) => void;
}

export function AddListaDialog({ open, onOpenChange, onAddLista }: AddListaDialogProps) {
  const [nome, setNome] = useState('');

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast.error('Digite um nome para a lista');
      return;
    }

    const novaLista: Lista = {
      id: Date.now().toString(),
      nome: nome.trim(),
      dataCriacao: new Date().toISOString(),
      itens: [],
      concluida: false,
    };

    onAddLista(novaLista);
    setNome('');
    onOpenChange(false);
    toast.success('Lista criada');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Lista</DialogTitle>
          <DialogDescription>
            Crie uma nova lista de compras
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome da Lista</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Compras do mês"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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