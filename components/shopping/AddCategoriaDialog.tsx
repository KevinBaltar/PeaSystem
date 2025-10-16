import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Categoria } from '../../types/shopping';
import { toast } from 'sonner';

interface AddCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategoria: (categoria: Categoria) => void;
  categoriaEdit?: Categoria | null;
}

const CORES_SUGERIDAS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6b7280',
];

export function AddCategoriaDialog({ open, onOpenChange, onAddCategoria, categoriaEdit }: AddCategoriaDialogProps) {
  const [nome, setNome] = useState(categoriaEdit?.nome || '');
  const [cor, setCor] = useState(categoriaEdit?.cor || CORES_SUGERIDAS[0]);

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast.error('Digite um nome para a categoria');
      return;
    }

    const categoria: Categoria = {
      id: categoriaEdit?.id || Date.now().toString(),
      nome: nome.trim(),
      cor,
    };

    onAddCategoria(categoria);
    setNome('');
    setCor(CORES_SUGERIDAS[0]);
    onOpenChange(false);
    toast.success(categoriaEdit ? 'Categoria atualizada' : 'Categoria criada');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoriaEdit ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          <DialogDescription>
            {categoriaEdit ? 'Edite as informações da categoria' : 'Crie uma nova categoria para organizar seus produtos'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome da Categoria</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Snacks"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div>
            <Label>Cor</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {CORES_SUGERIDAS.map(corSugerida => (
                <button
                  key={corSugerida}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    cor === corSugerida ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: corSugerida }}
                  onClick={() => setCor(corSugerida)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {categoriaEdit ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}