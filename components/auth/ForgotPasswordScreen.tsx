import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { ShoppingBag, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordScreenProps {
  onResetPassword: (email: string) => Promise<void>;
  onBack: () => void;
}

export function ForgotPasswordScreen({ 
  onResetPassword, 
  onBack 
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Digite seu email');
      return;
    }

    setLoading(true);
    try {
      await onResetPassword(email);
      setEmailSent(true);
      toast.success('Email enviado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
        <Card className="w-full max-w-md p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2>Email enviado!</h2>
            <p className="text-muted-foreground">
              Enviamos as instruções de recuperação de senha para <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm text-left space-y-2">
            <p className="text-muted-foreground">
              📧 Verifique sua caixa de entrada e spam
            </p>
            <p className="text-muted-foreground">
              🔗 Clique no link do email para redefinir sua senha
            </p>
            <p className="text-muted-foreground">
              ⏰ O link expira em 1 hora
            </p>
          </div>

          <Button
            onClick={onBack}
            className="w-full"
          >
            Voltar para login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </button>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1>Recuperar senha</h1>
          <p className="text-muted-foreground">
            Digite seu email para receber as instruções
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar instruções'
            )}
          </Button>
        </form>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 Você receberá um email com um link para criar uma nova senha
          </p>
        </div>
      </Card>
    </div>
  );
}
