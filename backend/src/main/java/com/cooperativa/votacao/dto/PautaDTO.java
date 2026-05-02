package com.cooperativa.votacao.dto;

import java.time.LocalDateTime;

public record PautaDTO(
    Long id,
    String descricao,
    LocalDateTime dataFechamento,
    boolean sessaoAberta
) {}
