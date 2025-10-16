# 🔐 Configuração Rápida do Google OAuth

## ✅ Checklist Rápido

- [ ] Criar projeto no Google Cloud Console
- [ ] Configurar tela de consentimento OAuth
- [ ] Criar credenciais OAuth 2.0
- [ ] Copiar Client ID e Client Secret
- [ ] Configurar provider Google no Supabase
- [ ] Testar login

---

## 📋 Instruções Passo a Passo

### 1️⃣ Google Cloud Console (5 minutos)

**1.1 Acessar e criar projeto**
- Acesse: https://console.cloud.google.com
- Clique em **Select a project** → **NEW PROJECT**
- Nome: `Lista de Compras App`
- Clique em **CREATE**

**1.2 Configurar tela de consentimento**
- Menu: **APIs & Services** → **OAuth consent screen**
- User Type: Selecione **External** → **CREATE**
- Preencha:
  - App name: `Lista de Compras`
  - User support email: seu email
  - Developer contact: seu email
- Clique **SAVE AND CONTINUE** (3 vezes)
- Clique **BACK TO DASHBOARD**

**1.3 Criar credenciais OAuth**
- Menu: **APIs & Services** → **Credentials**
- Clique: **+ CREATE CREDENTIALS** → **OAuth client ID**
- Application type: **Web application**
- Name: `Lista de Compras Web`
- **Authorized JavaScript origins:**
  ```
  https://[SEU-PROJETO-ID].supabase.co
  http://localhost:5173
  ```
- **Authorized redirect URIs:**
  ```
  https://[SEU-PROJETO-ID].supabase.co/auth/v1/callback
  ```
- Clique **CREATE**
- ✅ **COPIE o Client ID e Client Secret**

> **💡 Dica:** Substitua `[SEU-PROJETO-ID]` pelo ID real do seu projeto Supabase

---

### 2️⃣ Supabase Dashboard (2 minutos)

**2.1 Acessar configurações**
- Acesse: https://app.supabase.com
- Selecione seu projeto
- Menu lateral: **Authentication** → **Providers**

**2.2 Configurar Google**
- Encontre **Google** na lista
- Toggle: **Enable Sign in with Google** → ON
- Cole:
  - **Client ID:** (do Google Cloud Console)
  - **Client Secret:** (do Google Cloud Console)
- Clique **Save**

✅ **Configuração concluída!**

---

### 3️⃣ Testar (1 minuto)

1. Abra o aplicativo
2. Tela de Login → Clique no botão **Google**
3. Selecione sua conta Google
4. Permita o acesso
5. Você será redirecionado e logado automaticamente

---

## 🔧 Solução de Problemas

### ❌ Erro: "provider is not enabled"
**Solução:** Verifique se habilitou o provider Google no Supabase (Passo 2.2)

### ❌ Erro: "redirect_uri_mismatch"
**Solução:** 
- Verifique se a URI de redirecionamento está correta no Google Cloud Console
- Formato correto: `https://[projeto-id].supabase.co/auth/v1/callback`
- Certifique-se de usar o Project ID correto do Supabase

### ❌ Erro: "invalid_client"
**Solução:** Verifique se copiou corretamente o Client ID e Client Secret

### ❌ Login funciona mas usuário não aparece
**Solução:** 
- Verifique o console do navegador (F12) para erros
- Verifique se a sessão foi criada no Supabase Dashboard → Authentication → Users

---

## 📱 URLs do Seu Projeto

Para encontrar o ID do seu projeto Supabase:
1. Dashboard Supabase → Selecione seu projeto
2. Menu: **Settings** → **General**
3. Copie o **Reference ID** (formato: `abcdefghijklmnop`)

Suas URLs serão:
- **JavaScript Origin:** `https://abcdefghijklmnop.supabase.co`
- **Redirect URI:** `https://abcdefghijklmnop.supabase.co/auth/v1/callback`

---

## 📚 Links Úteis

- [Documentação Supabase - Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com)
- [Supabase Dashboard](https://app.supabase.com)

---

## ⏱️ Tempo Total Estimado

- Google Cloud: **~5 minutos**
- Supabase: **~2 minutos**
- Teste: **~1 minuto**

**Total: ~8 minutos** ⚡
