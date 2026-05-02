import React, { useState } from 'react';
import { Play, BarChart2, CheckCircle2, XCircle, Clock, Trash2, RotateCcw } from 'lucide-react';
import type { PautaDTO, ResultadoDTO } from '../types/pauta';
import { api } from '../services/api';
import { Modal } from './Modal';
import { CountdownTimer } from './CountdownTimer';
import type { ModalType } from './Modal';
import './PautaCard.css';

interface Props {
  pauta: PautaDTO;
  mode: 'admin' | 'user';
  onRefresh: () => void;
}

interface ModalState {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

const MODAL_HIDDEN: ModalState = { visible: false, type: 'info', title: '', message: '' };

export const PautaCard: React.FC<Props> = ({ pauta, mode, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoDTO | null>(null);
  const [cpf, setCpf] = useState('');
  const [duracao, setDuracao] = useState(1);
  const [modal, setModal] = useState<ModalState>(MODAL_HIDDEN);

  const showModal = (type: ModalType, message: string, title = '') =>
    setModal({ ...MODAL_HIDDEN, visible: true, type, title, message });

  const handleAbrirSessao = async () => {
    try {
      setLoading(true);
      await api.abrirSessao(pauta.id, duracao);
      onRefresh();
    } catch (error: any) {
      showModal('error', error.message || 'Não foi possível abrir a sessão.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletar = () => {
    setModal({
      visible: true,
      type: 'error',
      title: 'Excluir Pauta',
      message: 'Tem certeza que deseja excluir esta pauta? Todos os votos e sessões serão perdidos permanentemente.',
      confirmText: 'Excluir agora',
      onConfirm: async () => {
        try {
          setLoading(true);
          setModal(MODAL_HIDDEN);
          await api.deletarPauta(pauta.id);
          onRefresh();
        } catch (error: any) {
          showModal('error', error.message || 'Erro ao excluir pauta.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const confirmReabrir = () => {
    setModal({
      visible: true,
      type: 'info',
      title: 'Prorrogar Votação',
      message: `Deseja prorrogar esta votação por mais ${duracao} minuto(s)? Os votos já registrados serão mantidos.`,
      confirmText: 'Prorrogar agora',
      onConfirm: async () => {
        try {
          setLoading(true);
          setModal(MODAL_HIDDEN);
          await api.reabrirSessao(pauta.id, duracao);
          onRefresh();
        } catch (error: any) {
          showModal('error', error.message || 'Erro ao prorrogar sessão.');
        } finally {
          setLoading(false);
        }
      }
    });
  };


  const handleVerResultado = async () => {
    try {
      setLoading(true);
      const res = await api.obterResultado(pauta.id);
      setResultado(resultado ? null : res);
    } catch {
      showModal('info', 'Ainda não há votos registrados nesta pauta.');
    } finally {
      setLoading(false);
    }
  };

  const handleVotar = async (escolha: 'SIM' | 'NAO') => {
    if (!cpf.trim()) {
      showModal('info', 'Por favor, informe seu CPF antes de votar.');
      return;
    }
    try {
      setLoading(true);
      await api.votar(pauta.id, cpf.trim(), escolha);
      showModal('success', `Seu voto **${escolha}** foi registrado com sucesso! ✅`);
      setCpf('');
    } catch (error: any) {
      showModal('error', error.message || 'Erro desconhecido ao registrar o voto.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (pauta.sessaoAberta) return <span className="badge badge-open">Em Votação</span>;
    if (pauta.dataFechamento) return <span className="badge badge-closed">Encerrada</span>;
    return <span className="badge badge-new">Nova</span>;
  };

  return (
    <>
      {modal.visible && (
        <Modal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(MODAL_HIDDEN)}
          onConfirm={modal.onConfirm}
          confirmText={modal.confirmText}
        />
      )}

      <div className="pauta-card">
        <div className="pauta-header">
          <h3 className="pauta-title">{pauta.descricao}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {getStatusBadge()}
            {mode === 'admin' && (
              <button 
                className="btn-icon-delete" 
                onClick={confirmDeletar} 
                disabled={loading}
                title="Excluir Pauta"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>


        {/* Countdown visível quando sessão está aberta */}
        {pauta.sessaoAberta && pauta.dataFechamento && (
          <CountdownTimer dataFechamento={pauta.dataFechamento} />
        )}

        {/* === MODO ADMIN === */}
        {mode === 'admin' && !pauta.dataFechamento && !pauta.sessaoAberta && (
          <div className="admin-session-row">
            <div className="duracao-control">
              <Clock size={14} color="var(--text-secondary)" />
              <input
                type="number"
                min={1}
                max={60}
                value={duracao}
                onChange={(e) => setDuracao(Number(e.target.value))}
                className="duracao-input"
                disabled={loading}
              />
              <span className="duracao-label">min</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAbrirSessao}
              disabled={loading}
            >
              <Play size={16} /> Abrir Sessão
            </button>
          </div>
        )}

        {mode === 'admin' && pauta.dataFechamento && !pauta.sessaoAberta && (
           <div className="admin-session-row">
           <div className="duracao-control">
             <Clock size={14} color="var(--text-secondary)" />
             <input
               type="number"
               min={1}
               max={60}
               value={duracao}
               onChange={(e) => setDuracao(Number(e.target.value))}
               className="duracao-input"
               disabled={loading}
             />
             <span className="duracao-label">min</span>
           </div>
           <button
             className="btn btn-warning"
             onClick={confirmReabrir}
             disabled={loading}
             title="Reabrir sessão (limpará os votos atuais)"
           >
             <RotateCcw size={16} /> Reabrir Votação
           </button>
         </div>
        )}

        {mode === 'admin' && pauta.sessaoAberta && (
          <p className="sessao-info">
            <Clock size={13} /> Sessão em andamento — aguardando votos
          </p>
        )}

        {/* === MODO USER === */}
        {mode === 'user' && pauta.sessaoAberta && (
          <div className="voting-section">
            <input
              type="text"
              className="voting-input"
              placeholder="Digite seu CPF (apenas números)"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
              maxLength={11}
            />
            <div className="voting-buttons">
              <button
                className="btn btn-vote-sim"
                onClick={() => handleVotar('SIM')}
                disabled={loading || cpf.length < 11}
              >
                <CheckCircle2 size={16} /> SIM
              </button>
              <button
                className="btn btn-vote-nao"
                onClick={() => handleVotar('NAO')}
                disabled={loading || cpf.length < 11}
              >
                <XCircle size={16} /> NÃO
              </button>
            </div>
          </div>
        )}

        {mode === 'user' && !pauta.sessaoAberta && (
          <p className="sessao-fechada-msg">
            {pauta.dataFechamento
              ? '🔒 Sessão encerrada. Esta pauta não aceita mais votos.'
              : '⏳ Sessão ainda não foi aberta pelo administrador.'}
          </p>
        )}

        {/* === RESULTADOS (somente ADMIN) === */}
        {mode === 'admin' && (
          <div className="pauta-actions">
            <button
              className="btn btn-secondary"
              onClick={handleVerResultado}
              disabled={loading}
            >
              <BarChart2 size={16} /> {resultado ? 'Ocultar' : 'Ver Resultado'}
            </button>
          </div>
        )}

        {resultado && mode === 'admin' && (
          <div className="results-preview">
            <div>
              <span style={{ color: 'var(--success-color)' }}>
                <CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> SIM:
              </span>
              <strong>{resultado.votos['SIM'] || 0}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--danger-color)' }}>
                <XCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> NÃO:
              </span>
              <strong>{resultado.votos['NAO'] || 0}</strong>
            </div>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span>Total:</span> <strong>{resultado.totalVotos} votos</strong>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
