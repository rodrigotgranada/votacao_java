package com.cooperativa.votacao.service;

import com.cooperativa.votacao.dto.CpfStatusDto;
import com.cooperativa.votacao.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class CpfValidatorService {

    private final Random random = new Random();

    public CpfStatusDto validarCpf(String cpf) {
        int chance = random.nextInt(100);

        if (chance < 10) {
            throw new ResourceNotFoundException("CPF inválido ou inexistente");
        }

        if (chance < 30) {
            return new CpfStatusDto("UNABLE_TO_VOTE");
        }

        return new CpfStatusDto("ABLE_TO_VOTE");
    }

}
