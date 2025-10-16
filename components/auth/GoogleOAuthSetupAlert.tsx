import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

export function GoogleOAuthSetupAlert() {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <div>
          <p className="font-medium">Google OAuth não configurado</p>
          <p className="text-sm mt-1">
            Para usar login com Google, você precisa configurar o OAuth no Supabase Dashboard.
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="font-medium">Passos rápidos:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Acesse o <a 
              href="https://console.cloud.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Google Cloud Console
            </a></li>
            <li>Crie credenciais OAuth 2.0</li>
            <li>Configure no <a 
              href="https://app.supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Supabase Dashboard
            </a></li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a
              href="https://supabase.com/docs/guides/auth/social-login/auth-google"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Guia Completo
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
