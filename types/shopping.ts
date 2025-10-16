export interface Categoria {
  id: string;
  nome: string;
  cor: string;
}

export interface PrecoHistorico {
  id: string;
  valor: number;
  data: string;
  local?: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoriaId: string;
  unidade: string;
  precos: PrecoHistorico[];
  foto?: string;
  marca?: string;
  quantidadePadrao?: number;
}

export interface ItemLista {
  id: string;
  produtoId: string;
  quantidade: number;
  comprado: boolean;
  precoCompra?: number;
}

export interface Lista {
  id: string;
  nome: string;
  dataCriacao: string;
  itens: ItemLista[];
  concluida: boolean;
  dataConclusao?: string;
  totalGasto?: number;
}

export interface HistoricoCompra {
  id: string;
  listaId: string;
  listaNome: string;
  data: string;
  totalGasto: number;
  itensComprados: number;
}