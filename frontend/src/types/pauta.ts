export interface PautaDTO {
  id: number;
  descricao: string;
  dataFechamento: string | null;
  sessaoAberta: boolean;
}


export interface ResultadoDTO {
  pautaId: number;
  descricao: string;
  votos: Record<string, number>;
  totalVotos: number;
}
