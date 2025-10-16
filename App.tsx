import { useState } from 'react';
import { ShoppingBag, Package, Tag, History, LogOut, User } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useShoppingData } from './hooks/useShoppingData';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { ListasTab } from './components/shopping/ListasTab';
import { ProdutosTab } from './components/shopping/ProdutosTab';
import { CategoriasTab } from './components/shopping/CategoriasTab';
import { HistoricoTab } from './components/shopping/HistoricoTab';
import { ListaDetail } from './components/shopping/ListaDetail';
import { ProdutoDetail } from './components/shopping/ProdutoDetail';
import { AddListaDialog } from './components/shopping/AddListaDialog';
import { AddProdutoDialog } from './components/shopping/AddProdutoDialog';
import { AddCategoriaDialog } from './components/shopping/AddCategoriaDialog';
import { ShareProductsDialog } from './components/shopping/ShareProductsDialog';
import { ImportProductsDialog } from './components/shopping/ImportProductsDialog';
import { Lista, Produto, Categoria } from './types/shopping';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

type Screen = 'listas' | 'produtos' | 'categorias' | 'historico';
type AuthScreen = 'login' | 'register' | 'forgot-password';

export default function App() {
  const { user, loading, signIn, signUp, signInWithGoogle, resetPassword, signOut } = useAuth();
  const { listas, setListas, produtos, setProdutos, categorias, setCategorias } = useShoppingData();
  const [activeScreen, setActiveScreen] = useState<Screen>('listas');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [selectedLista, setSelectedLista] = useState<Lista | null>(null);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  
  const [showAddLista, setShowAddLista] = useState(false);
  const [showAddProduto, setShowAddProduto] = useState(false);
  const [showAddCategoria, setShowAddCategoria] = useState(false);
  const [showShareProdutos, setShowShareProdutos] = useState(false);
  const [showImportProdutos, setShowImportProdutos] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null);

  // Auth handlers
  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    await signUp(email, password, name);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleResetPassword = async (email: string) => {
    await resetPassword(email);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
  };

  // Lista handlers
  const handleAddLista = (lista: Lista) => {
    setListas([...listas, lista]);
  };

  const handleUpdateLista = (updatedLista: Lista) => {
    setListas(listas.map(l => l.id === updatedLista.id ? updatedLista : l));
  };

  const handleDeleteLista = (id: string) => {
    setListas(listas.filter(l => l.id !== id));
  };

  const handleSelectLista = (lista: Lista) => {
    setSelectedLista(lista);
  };

  const handleReuseLista = (listaOriginal: Lista, novoNome: string) => {
    const novaLista: Lista = {
      id: Date.now().toString(),
      nome: novoNome,
      dataCriacao: new Date().toISOString(),
      concluida: false,
      itens: listaOriginal.itens.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random(),
        comprado: false,
        precoCompra: undefined, // Limpa o preço para o usuário inserir novos
      })),
    };
    setListas([...listas, novaLista]);
    toast.success('Nova lista criada com sucesso');
    setSelectedLista(novaLista);
  };

  // Produto handlers
  const handleAddProduto = (produto: Produto) => {
    setProdutos([...produtos, produto]);
  };

  const handleUpdateProduto = (updatedProduto: Produto) => {
    setProdutos(produtos.map(p => p.id === updatedProduto.id ? updatedProduto : p));
  };

  const handleDeleteProduto = (id: string) => {
    // Verificar se o produto está em alguma lista
    const produtoEmUso = listas.some(lista => 
      lista.itens.some(item => item.produtoId === id)
    );

    if (produtoEmUso) {
      toast.error('Este produto está em uma lista e não pode ser excluído');
      return;
    }

    setProdutos(produtos.filter(p => p.id !== id));
  };

  const handleSelectProduto = (produto: Produto) => {
    setSelectedProduto(produto);
  };

  const handleImportProdutos = (produtosImportados: Produto[]) => {
    setProdutos([...produtos, ...produtosImportados]);
  };

  // Categoria handlers
  const handleAddCategoria = (categoria: Categoria) => {
    if (categoriaEdit) {
      setCategorias(categorias.map(c => c.id === categoria.id ? categoria : c));
      setCategoriaEdit(null);
    } else {
      setCategorias([...categorias, categoria]);
    }
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setCategoriaEdit(categoria);
    setShowAddCategoria(true);
  };

  const handleDeleteCategoria = (id: string) => {
    const categoriaProdutos = produtos.filter(p => p.categoriaId === id).length;
    if (categoriaProdutos > 0) {
      toast.error('Esta categoria possui produtos e não pode ser excluída');
      return;
    }
    setCategorias(categorias.filter(c => c.id !== id));
    toast.success('Categoria excluída');
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show auth screens if not logged in
  if (!user) {
    if (authScreen === 'register') {
      return (
        <>
          <RegisterScreen
            onRegister={handleRegister}
            onGoogleLogin={handleGoogleLogin}
            onSwitchToLogin={() => setAuthScreen('login')}
          />
          <Toaster />
        </>
      );
    }

    if (authScreen === 'forgot-password') {
      return (
        <>
          <ForgotPasswordScreen
            onResetPassword={handleResetPassword}
            onBack={() => setAuthScreen('login')}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSwitchToRegister={() => setAuthScreen('register')}
          onForgotPassword={() => setAuthScreen('forgot-password')}
        />
        <Toaster />
      </>
    );
  }

  // Se estiver visualizando uma lista
  if (selectedLista) {
    return (
      <>
        <ListaDetail
          lista={selectedLista}
          produtos={produtos}
          categorias={categorias}
          onBack={() => setSelectedLista(null)}
          onUpdateLista={(updatedLista) => {
            handleUpdateLista(updatedLista);
            setSelectedLista(updatedLista);
          }}
          onDeleteLista={handleDeleteLista}
          onUpdateProduto={handleUpdateProduto}
          onSelectProduto={(produto) => {
            setSelectedProduto(produto);
            setSelectedLista(null);
          }}
          onReuseLista={handleReuseLista}
        />
        <Toaster />
      </>
    );
  }

  // Se estiver visualizando um produto
  if (selectedProduto) {
    const categoria = categorias.find(c => c.id === selectedProduto.categoriaId);
    return (
      <>
        <ProdutoDetail
          produto={selectedProduto}
          categoria={categoria}
          onBack={() => setSelectedProduto(null)}
          onUpdateProduto={(updatedProduto) => {
            handleUpdateProduto(updatedProduto);
            setSelectedProduto(updatedProduto);
          }}
          onDeleteProduto={handleDeleteProduto}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1>Lista de Compras</h1>
            <p className="text-sm text-muted-foreground">
              Organize suas compras e acompanhe preços
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p>{user.name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeScreen === 'listas' && (
          <ListasTab
            listas={listas}
            produtos={produtos}
            onAddLista={() => setShowAddLista(true)}
            onSelectLista={handleSelectLista}
            onDeleteLista={handleDeleteLista}
            onReuseLista={handleReuseLista}
          />
        )}

        {activeScreen === 'produtos' && (
          <ProdutosTab
            produtos={produtos}
            categorias={categorias}
            onAddProduto={() => setShowAddProduto(true)}
            onSelectProduto={handleSelectProduto}
            onShareProdutos={() => setShowShareProdutos(true)}
            onImportProdutos={() => setShowImportProdutos(true)}
          />
        )}

        {activeScreen === 'categorias' && (
          <CategoriasTab
            categorias={categorias}
            produtos={produtos}
            onAddCategoria={() => setShowAddCategoria(true)}
            onEditCategoria={handleEditCategoria}
            onDeleteCategoria={handleDeleteCategoria}
          />
        )}

        {activeScreen === 'historico' && (
          <HistoricoTab
            listas={listas}
            onSelectLista={handleSelectLista}
            onReuseLista={handleReuseLista}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-20 bg-background border-t">
        <div className="grid grid-cols-4">
          <button
            className={`flex flex-col items-center gap-1 p-3 transition-colors ${
              activeScreen === 'listas'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveScreen('listas')}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Listas</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-3 transition-colors ${
              activeScreen === 'produtos'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveScreen('produtos')}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">Produtos</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-3 transition-colors ${
              activeScreen === 'categorias'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveScreen('categorias')}
          >
            <Tag className="w-5 h-5" />
            <span className="text-xs">Categorias</span>
          </button>

          <button
            className={`flex flex-col items-center gap-1 p-3 transition-colors ${
              activeScreen === 'historico'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveScreen('historico')}
          >
            <History className="w-5 h-5" />
            <span className="text-xs">Histórico</span>
          </button>
        </div>
      </nav>

      {/* Dialogs */}
      <AddListaDialog
        open={showAddLista}
        onOpenChange={setShowAddLista}
        onAddLista={handleAddLista}
      />

      <AddProdutoDialog
        open={showAddProduto}
        onOpenChange={setShowAddProduto}
        onAddProduto={handleAddProduto}
        categorias={categorias}
      />

      <AddCategoriaDialog
        open={showAddCategoria}
        onOpenChange={(open) => {
          setShowAddCategoria(open);
          if (!open) setCategoriaEdit(null);
        }}
        onAddCategoria={handleAddCategoria}
        categoriaEdit={categoriaEdit}
      />

      <ShareProductsDialog
        open={showShareProdutos}
        onOpenChange={setShowShareProdutos}
        produtos={produtos}
        categorias={categorias}
      />

      <ImportProductsDialog
        open={showImportProdutos}
        onOpenChange={setShowImportProdutos}
        onImportProdutos={handleImportProdutos}
        categorias={categorias}
        existingProdutos={produtos}
      />

      <Toaster />
    </div>
  );
}