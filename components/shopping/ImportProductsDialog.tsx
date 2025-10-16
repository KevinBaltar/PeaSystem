import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Produto, Categoria } from '../../types/shopping';
import { Download, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportProdutos: (produtos: Produto[]) => void;
  categorias: Categoria[];
  existingProdutos: Produto[];
}

export function ImportProductsDialog({
  open,
  onOpenChange,
  onImportProdutos,
  categorias,
  existingProdutos,
}: ImportProductsDialogProps) {
  const [shareCode, setShareCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundProdutos, setFoundProdutos] = useState<Produto[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!shareCode.trim()) {
      toast.error('Digite um código válido');
      return;
    }

    setIsLoading(true);

    try {
      // Simular busca de produtos compartilhados
      toast.info('Funcionalidade de importação em desenvolvimento');
      toast.warning('Por enquanto, os produtos são salvos apenas localmente');
      
      // Simular dados vazios
      setFoundProdutos([]);
      setExpiresAt(null);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error fetching shared products:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar produtos');
      setFoundProdutos([]);
      setSelectedIds([]);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProduto = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === foundProdutos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(foundProdutos.map(p => p.id));
    }
  };

  const handleImport = () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos um produto');
      return;
    }

    const produtosToImport = foundProdutos
      .filter(p => selectedIds.includes(p.id))
      .map(p => ({
        ...p,
        id: Date.now().toString() + Math.random(), // Generate new ID
      }));

    onImportProdutos(produtosToImport);
    toast.success(`${produtosToImport.length} produto(s) importado(s)`);
    handleClose();
  };

  const handleClose = () => {
    setShareCode('');
    setFoundProdutos([]);
    setSelectedIds([]);
    setExpiresAt(null);
    onOpenChange(false);
  };

  const isProdutoDuplicate = (produto: Produto) => {
    return existingProdutos.some(p => p.nome.toLowerCase() === produto.nome.toLowerCase());
  };

  const getCategoriaName = (categoriaId: string) => {
    return categorias.find(c => c.id === categoriaId)?.nome || 'Sem categoria';
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Importar Produtos
          </DialogTitle>
          <DialogDescription>
            Digite o código de compartilhamento para importar produtos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de compartilhamento</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="Ex: ABC123"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="uppercase font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !shareCode.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {foundProdutos.length > 0 && (
            <>
              <div className="flex items-center justify-between py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedIds.length === foundProdutos.length ? 'Desmarcar todos' : 'Selecionar todos'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selecionado(s)
                </span>
              </div>

              {expiresAt && (
                <p className="text-xs text-muted-foreground text-center">
                  Código válido até: {formatExpirationDate(expiresAt)}
                </p>
              )}

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {foundProdutos.map(produto => {
                    const isDuplicate = isProdutoDuplicate(produto);
                    return (
                      <label
                        key={produto.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                          isDuplicate ? 'opacity-60' : ''
                        }`}
                      >
                        <Checkbox
                          checked={selectedIds.includes(produto.id)}
                          onCheckedChange={() => handleToggleProduto(produto.id)}
                          disabled={isDuplicate}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{produto.nome}</p>
                            {isDuplicate && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded">
                                Já cadastrado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {getCategoriaName(produto.categoriaId)}
                            </span>
                            {produto.marca && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{produto.marca}</span>
                              </>
                            )}
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {produto.precos.length} preço(s)
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedIds.length === 0}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Importar ({selectedIds.length})
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
