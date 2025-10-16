import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { ShoppingBag, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleOAuthSetupAlert } from './GoogleOAuthSetupAlert';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ 
  onLogin, 
  onGoogleLogin, 
  onSwitchToRegister, 
  onForgotPassword 
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleSetupAlert, setShowGoogleSetupAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
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
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1>Lista de Compras</h1>
            <p className="text-muted-foreground">
              Faça login para gerenciar suas compras
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
                disabled={loading || googleLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:underline"
                  disabled={loading || googleLoading}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                autoComplete="current-password"
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
                  Entrando...
                </>
              ) : (
                'Entrar'
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
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline"
              disabled={loading || googleLoading}
            >
              Cadastre-se
            </button>
          </div>
        </Card>

        {showGoogleSetupAlert && <GoogleOAuthSetupAlert />}
      </div>
    </div>
  );
}
