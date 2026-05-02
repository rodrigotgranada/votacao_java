import React, { useState, useEffect } from 'react';

interface Props {
  dataFechamento: string;
}

function calcularRestante(dataFechamento: string) {
  const isoUtc = dataFechamento.includes('Z') || dataFechamento.includes('+')
    ? dataFechamento
    : dataFechamento + 'Z';

  const diffMs = new Date(isoUtc).getTime() - Date.now();
  if (diffMs <= 0) return null;

  const totalSeg = Math.floor(diffMs / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;
  return { min, seg, totalSeg };
}

export const CountdownTimer: React.FC<Props> = ({ dataFechamento }) => {
  const [restante, setRestante] = useState(() => calcularRestante(dataFechamento));

  useEffect(() => {
    const id = setInterval(() => {
      const r = calcularRestante(dataFechamento);
      setRestante(r);
      if (!r) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [dataFechamento]);

  if (!restante) {
    return <span className="countdown countdown-ending">Encerrando...</span>;
  }

  const isUrgente = restante.totalSeg <= 30;

  return (
    <span className={`countdown ${isUrgente ? 'countdown-urgent' : ''}`}>
      ⏱ {restante.min}min {String(restante.seg).padStart(2, '0')}s restantes
    </span>
  );
};
