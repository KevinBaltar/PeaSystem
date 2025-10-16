# Shopping List

Uma aplicação de lista de compras desenvolvida com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- ✅ Autenticação com Supabase (Email/Password e Google OAuth)
- 📝 Criação e gerenciamento de listas de compras
- 🛒 Catálogo de produtos com categorias
- 💰 Acompanhamento de preços históricos
- 📊 Histórico de compras
- 📱 Interface responsiva e moderna

## 🛠️ Tecnologias

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Supabase (Auth + Database)
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd shopping-list
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Configure as variáveis em `utils/supabase/info.tsx`
   - Execute as migrações necessárias no banco

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

## 🎯 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
├── components/           # Componentes React
│   ├── auth/            # Componentes de autenticação
│   ├── shopping/        # Componentes da funcionalidade principal
│   └── ui/              # Componentes de interface (Radix UI)
├── hooks/               # Custom hooks
├── types/               # Definições TypeScript
├── utils/               # Utilitários e configurações
├── styles/              # Estilos globais
└── supabase/            # Funções serverless do Supabase
```

## 🔧 Configuração

### Supabase
1. Crie um projeto no Supabase
2. Configure as tabelas necessárias
3. Atualize `utils/supabase/info.tsx` com suas credenciais

### Google OAuth (Opcional)
Para habilitar login com Google, siga as instruções em `GOOGLE_OAUTH_SETUP.md`.

## 📱 Como Usar

1. **Registre-se** ou faça login
2. **Crie categorias** para organizar seus produtos
3. **Adicione produtos** ao catálogo
4. **Crie listas** de compras
5. **Acompanhe preços** e histórico de compras

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
