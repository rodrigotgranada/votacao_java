import type { PautaDTO, ResultadoDTO } from '../types/pauta';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const api = {
  obterPautas: async (): Promise<PautaDTO[]> => {
    const response = await fetch(`${API_URL}/pautas`);
    if (!response.ok) throw new Error('Erro ao buscar pautas');
    const json = await response.json();
    return json.dados as PautaDTO[];
  },

  cadastrarPauta: async (descricao: string): Promise<void> => {
    const response = await fetch(`${API_URL}/pautas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descricao })
    });
    if (!response.ok) throw new Error('Erro ao cadastrar pauta');
  },


  abrirSessao: async (pautaId: number, duracao?: number): Promise<void> => {
    const url = new URL(`${API_URL}/pautas/${pautaId}/abrir-sessao`);
    if (duracao) {
      url.searchParams.append('duracao', duracao.toString());
    }
    const response = await fetch(url.toString(), { method: 'POST' });
    if (!response.ok) throw new Error('Erro ao abrir sessão');
  },

  votar: async (pautaId: number, associadoId: string, escolha: 'SIM' | 'NAO'): Promise<void> => {
    const response = await fetch(`${API_URL}/pautas/${pautaId}/votos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ associadoId, escolha })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || 'Erro ao registrar voto.');
    }
  },

  obterResultado: async (pautaId: number): Promise<ResultadoDTO> => {
    const response = await fetch(`${API_URL}/pautas/${pautaId}/resultado`);
    if (!response.ok) throw new Error('Erro ao buscar resultado');
    return await response.json();
  },

  deletarPauta: async (pautaId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/pautas/${pautaId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir pauta');
  },

  reabrirSessao: async (pautaId: number, duracao?: number): Promise<void> => {
    const url = new URL(`${API_URL}/pautas/${pautaId}/reabrir-sessao`);
    if (duracao) {
      url.searchParams.append('duracao', duracao.toString());
    }
    const response = await fetch(url.toString(), { method: 'POST' });
    if (!response.ok) throw new Error('Erro ao reabrir sessão');
  }
};

