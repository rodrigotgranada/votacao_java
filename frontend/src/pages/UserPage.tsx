import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { PautaCard } from '../components/PautaCard';
import type { PautaDTO } from '../types/pauta';
import { api } from '../services/api';
import './Page.css';

export const UserPage: React.FC = () => {
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

  const pautasAbertas = pautas.filter((p) => p.sessaoAberta);
  const pautasFechadas = pautas.filter((p) => !p.sessaoAberta);

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        <div className="page-header-title">
          <Users size={18} color="var(--success-color)" />
          <h2>Sessões de Votação</h2>
        </div>
      </div>

      <main className="page-content">
        {loading && pautas.length === 0 && (
          <div className="loading-state">Buscando sessões abertas...</div>
        )}
        {error && <div className="error-state">{error}</div>}

        {!error && (
          <>
            {pautasAbertas.length > 0 && (
              <section>
                <div className="section-label section-label-open">
                  🟢 Votação em Andamento ({pautasAbertas.length})
                </div>
                {pautasAbertas.map((pauta) => (
                  <PautaCard key={pauta.id} pauta={pauta} mode="user" onRefresh={() => carregarPautas(false)} />
                ))}
              </section>
            )}

            {pautasFechadas.length > 0 && (
              <section>
                <div className="section-label section-label-closed">
                  🔒 Outras Pautas ({pautasFechadas.length})
                </div>
                {pautasFechadas.map((pauta) => (
                  <PautaCard key={pauta.id} pauta={pauta} mode="user" onRefresh={() => carregarPautas(false)} />
                ))}
              </section>
            )}

            {!loading && pautas.length === 0 && (
              <div className="empty-state">
                <p>Nenhuma pauta cadastrada ainda. Aguarde o Administrador. 🕐</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
