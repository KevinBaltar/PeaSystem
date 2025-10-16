# Configuração de Autenticação

Este aplicativo usa Supabase Auth para autenticação de usuários.

## Funcionalidades Implementadas

✅ Login com email e senha  
✅ Cadastro de novos usuários  
✅ Recuperação de senha via email  
✅ Login social com Google  
✅ Logout  
✅ Proteção de rotas  

## Como Funciona

### Login e Cadastro
- Os usuários podem criar uma conta com email, senha e nome
- As senhas devem ter no mínimo 6 caracteres
- O email é automaticamente confirmado (pois não há servidor de email configurado)
- Após o cadastro, o login é feito automaticamente

### Login com Google

**⚠️ IMPORTANTE:** Para usar o login com Google, você precisa configurar o OAuth no Supabase:

#### Passo 1: Configurar Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. No menu lateral, vá em **APIs e Serviços** → **Tela de permissão OAuth**
4. Configure a tela de consentimento:
   - Escolha **External** (ou Internal se for Google Workspace)
   - Preencha os campos obrigatórios (nome do app, email de suporte, etc.)
   - Adicione os escopos necessários (email, profile, openid)
   - Salve e continue

5. Vá em **APIs e Serviços** → **Credenciais**
6. Clique em **+ CRIAR CREDENCIAIS** → **ID do cliente OAuth**
7. Selecione **Aplicativo da Web**
8. Configure:
   - **Nome:** Lista de Compras (ou qualquer nome)
   - **Origens JavaScript autorizadas:** Adicione:
     - `https://<seu-projeto>.supabase.co`
     - `http://localhost:5173` (para desenvolvimento local)
   - **URIs de redirecionamento autorizados:** Adicione:
     - `https://<seu-projeto>.supabase.co/auth/v1/callback`
9. Clique em **CRIAR**
10. **Copie o Client ID e Client Secret** (você vai precisar no próximo passo)

#### Passo 2: Configurar Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, vá em **Authentication** → **Providers**
4. Encontre **Google** na lista e clique para expandir
5. Toggle **Enable Sign in with Google** para ON
6. Cole o **Client ID** e **Client Secret** que você copiou do Google Cloud Console
7. Clique em **Save**

#### Passo 3: Testar

1. No aplicativo, clique no botão "Google" na tela de login ou cadastro
2. Você será redirecionado para a tela de login do Google
3. Após fazer login, será redirecionado de volta para o aplicativo

**Nota:** Se você receber erro "provider is not enabled", verifique se completou o Passo 2 corretamente.

📖 Documentação completa: https://supabase.com/docs/guides/auth/social-login/auth-google

### Recuperação de Senha

Quando o usuário solicita recuperação de senha:
1. Um email é enviado para o endereço cadastrado
2. O email contém um link para redefinir a senha
3. O link expira em 1 hora
4. Após clicar no link, o usuário pode criar uma nova senha

**Nota:** A funcionalidade de envio de email depende da configuração de um servidor SMTP no Supabase.

## Estrutura de Código

### Componentes de Autenticação
- `/components/auth/LoginScreen.tsx` - Tela de login
- `/components/auth/RegisterScreen.tsx` - Tela de cadastro
- `/components/auth/ForgotPasswordScreen.tsx` - Tela de recuperação de senha

### Hooks
- `/hooks/useAuth.ts` - Hook customizado para gerenciar autenticação

### Backend
- `/supabase/functions/server/index.tsx` - Rota `/signup` para criar usuários

### Utilitários
- `/utils/supabase/client.tsx` - Cliente Supabase (singleton)

## Fluxo de Autenticação

1. **Primeira Visita**
   - Usuário vê a tela de login
   - Pode escolher entre login, cadastro ou recuperação de senha

2. **Após Login**
   - O estado do usuário é salvo no Supabase Auth
   - A sessão é mantida mesmo após fechar o navegador
   - O usuário tem acesso a todas as funcionalidades do app

3. **Logout**
   - Menu de usuário no canto superior direito
   - Clique em "Sair" para fazer logout
   - Retorna para a tela de login

## Segurança

- As senhas são criptografadas pelo Supabase
- Tokens de acesso são gerenciados automaticamente
- A Service Role Key nunca é exposta ao frontend
- Sessões expiram automaticamente após período de inatividade

## Próximos Passos Recomendados

1. **Configurar Servidor de Email**
   - Para envio de emails de recuperação de senha
   - Para confirmação de email no cadastro

2. **Adicionar Mais Providers Sociais**
   - Facebook
   - GitHub
   - Apple

3. **Implementar Perfil de Usuário**
   - Tela para editar nome e email
   - Upload de foto de perfil
   - Alterar senha

4. **Adicionar 2FA (Autenticação de Dois Fatores)**
   - Para maior segurança das contas
