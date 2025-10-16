import { useState, useEffect } from 'react';
import { Lista, Produto, Categoria } from '../types/shopping';

const STORAGE_KEYS = {
  LISTAS: 'shopping-listas',
  PRODUTOS: 'shopping-produtos',
  CATEGORIAS: 'shopping-categorias',
};

// Dados iniciais
const CATEGORIAS_INICIAIS: Categoria[] = [
  { id: '1', nome: 'Frutas e Verduras', cor: '#10b981' },
  { id: '2', nome: 'Carnes', cor: '#ef4444' },
  { id: '3', nome: 'Laticínios', cor: '#3b82f6' },
  { id: '4', nome: 'Padaria', cor: '#f59e0b' },
  { id: '5', nome: 'Bebidas', cor: '#8b5cf6' },
  { id: '6', nome: 'Limpeza', cor: '#06b6d4' },
  { id: '7', nome: 'Higiene', cor: '#ec4899' },
  { id: '8', nome: 'Outros', cor: '#6b7280' },
];

const PRODUTOS_INICIAIS: Produto[] = [
  // Frutas e Verduras
  {
    id: 'p1',
    nome: 'Banana',
    categoriaId: '1',
    unidade: 'kg',
    quantidadePadrao: 1,
    precos: [
      { id: 'h1', valor: 4.99, data: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h2', valor: 5.49, data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h3', valor: 4.79, data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p2',
    nome: 'Tomate',
    categoriaId: '1',
    unidade: 'kg',
    quantidadePadrao: 1,
    precos: [
      { id: 'h4', valor: 6.99, data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), local: 'Feira' },
      { id: 'h5', valor: 7.49, data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p3',
    nome: 'Alface',
    categoriaId: '1',
    unidade: 'un',
    quantidadePadrao: 1,
    precos: [
      { id: 'h6', valor: 2.99, data: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), local: 'Feira' },
      { id: 'h7', valor: 3.49, data: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p4',
    nome: 'Maçã',
    categoriaId: '1',
    unidade: 'kg',
    quantidadePadrao: 1,
    precos: [
      { id: 'h8', valor: 7.99, data: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },

  // Carnes
  {
    id: 'p5',
    nome: 'Frango (Peito)',
    categoriaId: '2',
    unidade: 'kg',
    quantidadePadrao: 1,
    precos: [
      { id: 'h9', valor: 16.99, data: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), local: 'Açougue' },
      { id: 'h10', valor: 18.99, data: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p6',
    nome: 'Carne Moída',
    categoriaId: '2',
    unidade: 'kg',
    quantidadePadrao: 0.5,
    precos: [
      { id: 'h11', valor: 24.99, data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), local: 'Açougue' },
      { id: 'h12', valor: 26.99, data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },

  // Laticínios
  {
    id: 'p7',
    nome: 'Leite Integral',
    categoriaId: '3',
    unidade: 'L',
    quantidadePadrao: 1,
    marca: 'Itambé',
    precos: [
      { id: 'h13', valor: 5.49, data: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h14', valor: 5.79, data: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h15', valor: 5.29, data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p8',
    nome: 'Queijo Mussarela',
    categoriaId: '3',
    unidade: 'kg',
    quantidadePadrao: 0.3,
    precos: [
      { id: 'h16', valor: 42.99, data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h17', valor: 44.99, data: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p9',
    nome: 'Iogurte Natural',
    categoriaId: '3',
    unidade: 'un',
    quantidadePadrao: 1,
    marca: 'Nestlé',
    precos: [
      { id: 'h18', valor: 3.99, data: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },

  // Padaria
  {
    id: 'p10',
    nome: 'Pão Francês',
    categoriaId: '4',
    unidade: 'kg',
    quantidadePadrao: 0.5,
    precos: [
      { id: 'h19', valor: 12.99, data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), local: 'Padaria' },
      { id: 'h20', valor: 13.49, data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), local: 'Padaria' },
    ],
  },
  {
    id: 'p11',
    nome: 'Pão de Forma',
    categoriaId: '4',
    unidade: 'un',
    quantidadePadrao: 1,
    marca: 'Pullman',
    precos: [
      { id: 'h21', valor: 8.99, data: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h22', valor: 9.49, data: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },

  // Bebidas
  {
    id: 'p12',
    nome: 'Refrigerante Cola',
    categoriaId: '5',
    unidade: 'L',
    quantidadePadrao: 2,
    marca: 'Coca-Cola',
    precos: [
      { id: 'h23', valor: 7.99, data: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h24', valor: 6.99, data: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h25', valor: 7.49, data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p13',
    nome: 'Suco de Laranja',
    categoriaId: '5',
    unidade: 'L',
    quantidadePadrao: 1,
    marca: 'Del Valle',
    precos: [
      { id: 'h26', valor: 9.99, data: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },

  // Limpeza
  {
    id: 'p14',
    nome: 'Detergente',
    categoriaId: '6',
    unidade: 'un',
    quantidadePadrao: 1,
    marca: 'Ypê',
    precos: [
      { id: 'h27', valor: 2.49, data: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h28', valor: 2.79, data: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p15',
    nome: 'Sabão em Pó',
    categoriaId: '6',
    unidade: 'kg',
    quantidadePadrao: 1,
    marca: 'Omo',
    precos: [
      { id: 'h29', valor: 15.99, data: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h30', valor: 17.99, data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p16',
    nome: 'Papel Higiênico',
    categoriaId: '6',
    unidade: 'un',
    quantidadePadrao: 1,
    marca: 'Neve',
    precos: [
      { id: 'h31', valor: 18.99, data: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },

  // Higiene
  {
    id: 'p17',
    nome: 'Shampoo',
    categoriaId: '7',
    unidade: 'un',
    quantidadePadrao: 1,
    marca: 'Dove',
    precos: [
      { id: 'h32', valor: 12.99, data: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(), local: 'Farmácia' },
      { id: 'h33', valor: 13.99, data: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p18',
    nome: 'Sabonete',
    categoriaId: '7',
    unidade: 'un',
    quantidadePadrao: 4,
    marca: 'Dove',
    precos: [
      { id: 'h34', valor: 8.99, data: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },

  // Outros
  {
    id: 'p19',
    nome: 'Arroz',
    categoriaId: '8',
    unidade: 'kg',
    quantidadePadrao: 5,
    marca: 'Tio João',
    precos: [
      { id: 'h35', valor: 22.99, data: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h36', valor: 24.99, data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h37', valor: 21.99, data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), local: 'Atacado' },
    ],
  },
  {
    id: 'p20',
    nome: 'Feijão',
    categoriaId: '8',
    unidade: 'kg',
    quantidadePadrao: 1,
    marca: 'Camil',
    precos: [
      { id: 'h38', valor: 7.99, data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h39', valor: 8.49, data: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p21',
    nome: 'Óleo de Soja',
    categoriaId: '8',
    unidade: 'L',
    quantidadePadrao: 1,
    marca: 'Liza',
    precos: [
      { id: 'h40', valor: 6.99, data: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h41', valor: 7.49, data: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
  {
    id: 'p22',
    nome: 'Açúcar',
    categoriaId: '8',
    unidade: 'kg',
    quantidadePadrao: 1,
    marca: 'União',
    precos: [
      { id: 'h42', valor: 4.49, data: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
      { id: 'h43', valor: 4.79, data: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
    ],
  },
  {
    id: 'p23',
    nome: 'Café',
    categoriaId: '8',
    unidade: 'g',
    quantidadePadrao: 500,
    marca: 'Pilão',
    precos: [
      { id: 'h44', valor: 14.99, data: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado A' },
      { id: 'h45', valor: 15.99, data: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), local: 'Supermercado B' },
    ],
  },
];

export function useShoppingData() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedListas = localStorage.getItem(STORAGE_KEYS.LISTAS);
    const savedProdutos = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
    const savedCategorias = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);

    if (savedListas) setListas(JSON.parse(savedListas));
    
    if (savedProdutos) {
      setProdutos(JSON.parse(savedProdutos));
    } else {
      setProdutos(PRODUTOS_INICIAIS);
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    }
    
    if (savedCategorias) {
      setCategorias(JSON.parse(savedCategorias));
    } else {
      setCategorias(CATEGORIAS_INICIAIS);
      localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(CATEGORIAS_INICIAIS));
    }
  }, []);

  // Salvar listas
  useEffect(() => {
    if (listas.length > 0 || localStorage.getItem(STORAGE_KEYS.LISTAS)) {
      localStorage.setItem(STORAGE_KEYS.LISTAS, JSON.stringify(listas));
    }
  }, [listas]);

  // Salvar produtos
  useEffect(() => {
    if (produtos.length > 0 || localStorage.getItem(STORAGE_KEYS.PRODUTOS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    }
  }, [produtos]);

  // Salvar categorias
  useEffect(() => {
    if (categorias.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
    }
  }, [categorias]);

  return {
    listas,
    setListas,
    produtos,
    setProdutos,
    categorias,
    setCategorias,
  };
}