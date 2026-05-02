package com.cooperativa.votacao.dto;

import java.util.Map;

public record ResultadoDTO(
    Long pautaId,
    String descricao,
    Map<String, Long> votos,
    Long totalVotos
) {}
