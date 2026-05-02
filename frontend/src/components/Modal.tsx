import React from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import './Modal.css';

export type ModalType = 'success' | 'error' | 'info';

interface ModalProps {
  type: ModalType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

const icons: Record<ModalType, React.ReactNode> = {
  success: <CheckCircle2 size={24} />,
  error:   <XCircle size={24} />,
  info:    <Info size={24} />,
};

const titles: Record<ModalType, string> = {
  success: 'Sucesso!',
  error:   'Ops! Algo deu errado',
  info:    'Informação',
};

export const Modal: React.FC<ModalProps> = ({ type, title, message, onClose, onConfirm, confirmText }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <div className={`icon-wrapper ${type}`}>
            {icons[type]}
          </div>
        </div>
        <h3 className="modal-title">{title || titles[type]}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-footer" style={{ gap: '12px' }}>
          {onConfirm ? (
            <>
              <button className="modal-btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className={`modal-btn ${type}`} onClick={onConfirm}>
                {confirmText || 'Confirmar'}
              </button>
            </>
          ) : (
            <button className={`modal-btn ${type}`} onClick={onClose}>
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

