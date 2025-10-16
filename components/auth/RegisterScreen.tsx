import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { ShoppingBag, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleOAuthSetupAlert } from './GoogleOAuthSetupAlert';

interface RegisterScreenProps {
  onRegister: (email: string, password: string, name: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ 
  onRegister, 
  onGoogleLogin, 
  onSwitchToLogin 
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleSetupAlert, setShowGoogleSetupAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await onRegister(email, password, name);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setShowGoogleSetupAlert(false); // Hide alert when trying again
    try {
      await onGoogleLogin();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login com Google';
      
      // Check if it's a Google OAuth configuration error
      if (errorMessage.includes('provider') || errorMessage.includes('not enabled') || errorMessage.includes('OAuth')) {
        setShowGoogleSetupAlert(true);
      } else {
        toast.error(errorMessage);
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md space-y-4">
        <Card className="p-8 space-y-6">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading || googleLoading}
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
            <h1>Criar conta</h1>
            <p className="text-muted-foreground">
              Comece a organizar suas compras hoje
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Google
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
              disabled={loading || googleLoading}
            >
              Faça login
            </button>
          </div>
        </Card>

        {showGoogleSetupAlert && <GoogleOAuthSetupAlert />}
      </div>
    </div>
  );
}
