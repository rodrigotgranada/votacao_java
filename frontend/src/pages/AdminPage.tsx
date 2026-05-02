import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { NovaPauta } from '../components/NovaPauta';
import { PautaCard } from '../components/PautaCard';
import type { PautaDTO } from '../types/pauta';
import { api } from '../services/api';
import './Page.css';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [pautas, setPautas] = useState<PautaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPautas = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await api.obterPautas();
      setPautas(data);
    } catch {
      setError('Falha ao conectar com a API. O servidor está rodando?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPautas(true);
    const interval = setInterval(() => carregarPautas(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        <div className="page-header-title">
          <Settings size={18} color="var(--accent-color)" />
          <h2>Painel Admin</h2>
        </div>
      </div>

      <NovaPauta onSuccess={carregarPautas} />

      <main className="page-content">
        {loading && pautas.length === 0 && (
          <div className="loading-state">Carregando pautas...</div>
        )}
        {error && <div className="error-state">{error}</div>}
        {!loading && !error && pautas.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma pauta cadastrada ainda. Crie a primeira acima! 👆</p>
          </div>
        )}
        {pautas.map((pauta) => (
          <PautaCard key={pauta.id} pauta={pauta} mode="admin" onRefresh={carregarPautas} />
        ))}
      </main>
    </div>
  );
};
