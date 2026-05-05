package com.cooperativa.votacao.service;

import com.cooperativa.votacao.dto.CpfStatusDto;
import com.cooperativa.votacao.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.InputMismatchException;

@Service
public class CpfValidatorService {

    public CpfStatusDto validarCpf(String cpf) {
        if (cpf == null) {
            throw new BadRequestException("CPF não pode ser nulo");
        }

        String cleanedCpf = cpf.replaceAll("\\D", "");

        if (!isCpfValido(cleanedCpf)) {
            throw new BadRequestException("CPF inválido: Formato ou dígitos incorretos");
        }

        return new CpfStatusDto("ABLE_TO_VOTE");
    }

    private boolean isCpfValido(String cpf) {
        if (cpf.length() != 11 || cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
            char dig10, dig11;
            int sm, i, r, num, peso;

            sm = 0;
            peso = 10;
            for (i = 0; i < 9; i++) {
                num = (int) (cpf.charAt(i) - 48);
                sm = sm + (num * peso);
                peso = peso - 1;
            }

            r = 11 - (sm % 11);
            if ((r == 10) || (r == 11))
                dig10 = '0';
            else
                dig10 = (char) (r + 48);

            sm = 0;
            peso = 11;
            for (i = 0; i < 10; i++) {
                num = (int) (cpf.charAt(i) - 48);
                sm = sm + (num * peso);
                peso = peso - 1;
            }

            r = 11 - (sm % 11);
            if ((r == 10) || (r == 11))
                dig11 = '0';
            else
                dig11 = (char) (r + 48);

            return (dig10 == cpf.charAt(9)) && (dig11 == cpf.charAt(10));
        } catch (InputMismatchException erro) {
            return false;
        }
    }
}
