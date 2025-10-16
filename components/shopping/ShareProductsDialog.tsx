import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Produto, Categoria } from '../../types/shopping';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtos: Produto[];
  categorias: Categoria[];
}

export function ShareProductsDialog({
  open,
  onOpenChange,
  produtos,
  categorias,
}: ShareProductsDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleProduto = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === produtos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(produtos.map(p => p.id));
    }
  };

  const handleShare = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos um produto');
      return;
    }

    setIsSharing(true);

    try {
      // const produtosToShare = produtos.filter(p => selectedIds.includes(p.id));

      // Simular geração de código de compartilhamento
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      setShareCode(code);
      setExpiresAt(expiresAt);
      
      toast.success('Funcionalidade de compartilhamento em desenvolvimento');
      toast.info('Por enquanto, os produtos são salvos apenas localmente');
    } catch (error) {
      console.error('Error sharing products:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao compartilhar produtos');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast.success('Código copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setShareCode(null);
    setExpiresAt(null);
    setCopied(false);
    onOpenChange(false);
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
            <Share2 className="w-5 h-5" />
            Compartilhar Produtos
          </DialogTitle>
          <DialogDescription>
            {shareCode
              ? 'Compartilhe o código abaixo com outros usuários'
              : 'Selecione os produtos que deseja compartilhar'}
          </DialogDescription>
        </DialogHeader>

        {shareCode ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Código de compartilhamento</p>
                  <p className="text-2xl font-mono tracking-wider">{shareCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {expiresAt && (
                <p className="text-xs text-muted-foreground">
                  Válido até: {formatExpirationDate(expiresAt)}
                </p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 Outros usuários podem importar estes {selectedIds.length} produtos usando este código
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedIds.length === produtos.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selecionado(s)
              </span>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {produtos.map(produto => (
                  <label
                    key={produto.id}
                    className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(produto.id)}
                      onCheckedChange={() => handleToggleProduto(produto.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{produto.nome}</p>
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
                      </div>
                    </div>
                  </label>
                ))}
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
                onClick={handleShare}
                disabled={selectedIds.length === 0 || isSharing}
                className="flex-1"
              >
                {isSharing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Compartilhando...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
