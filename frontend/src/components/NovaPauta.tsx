import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import './NovaPauta.css';

interface Props {
  onSuccess: () => void;
}

export const NovaPauta: React.FC<Props> = ({ onSuccess }) => {
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    try {
      setLoading(true);
      await api.cadastrarPauta(descricao);
      setDescricao('');
      onSuccess();
    } catch (error) {
      alert('Erro ao cadastrar a pauta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nova-pauta-container">
      <form onSubmit={handleSubmit} className="nova-pauta-form">
        <input
          type="text"
          className="nova-pauta-input"
          placeholder="O que vamos votar hoje?"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          className="btn-submit" 
          disabled={loading || !descricao.trim()}
          title="Criar Pauta"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
      </form>
    </div>
  );
};
