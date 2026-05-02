package com.cooperativa.votacao.service;

import com.cooperativa.votacao.dto.PautaDTO;
import com.cooperativa.votacao.dto.ResultadoDTO;
import com.cooperativa.votacao.exception.BadRequestException;
import com.cooperativa.votacao.exception.ResourceNotFoundException;
import com.cooperativa.votacao.model.Pauta;
import com.cooperativa.votacao.model.Sessao;
import com.cooperativa.votacao.model.Voto;
import com.cooperativa.votacao.repository.PautaRepository;
import com.cooperativa.votacao.repository.SessaoRepository;
import com.cooperativa.votacao.repository.VotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VotacaoService {

    private final PautaRepository pautaRepository;
    private final SessaoRepository sessaoRepository;
    private final VotoRepository votoRepository;
    private final CpfValidatorService cpfValidatorService;

    public Pauta cadastrarPauta(String descricao) {
        Pauta pauta = new Pauta();
        pauta.setDescricao(descricao);
        return pautaRepository.save(pauta);
    }

    public Sessao abrirSessao(Long pautaId, Integer duracaoEmMinutos) {
        Pauta pauta = pautaRepository.findById(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pauta não encontrada"));

        if (sessaoRepository.findByPautaId(pautaId).isPresent()) {
            throw new BadRequestException("Já existe uma sessão aberta para esta pauta");
        }

        int minutos = (duracaoEmMinutos == null || duracaoEmMinutos <= 0) ? 1 : duracaoEmMinutos;

        Sessao sessao = new Sessao();
        sessao.setPauta(pauta);
        sessao.setDataAbertura(LocalDateTime.now());
        sessao.setDataFechamento(LocalDateTime.now().plusMinutes(minutos));

        return sessaoRepository.save(sessao);
    }

    @Transactional
    public Voto votar(Long pautaId, String associadoId, Voto.EscolhaVoto escolha) {
        var statusCpf = cpfValidatorService.validarCpf(associadoId);
        if ("UNABLE_TO_VOTE".equals(statusCpf.status())) {
            throw new BadRequestException("Associado não está apto a votar");
        }

        Sessao sessao = sessaoRepository.findByPautaId(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão de votação não encontrada para esta pauta"));

        if (!sessao.estaAberta()) {
            throw new BadRequestException("A sessão de votação está fechada");
        }

        if (votoRepository.existsByPautaIdAndAssociadoId(pautaId, associadoId)) {
            throw new BadRequestException("Associado já votou nesta pauta");
        }

        Voto voto = new Voto();
        voto.setPautaId(pautaId);
        voto.setAssociadoId(associadoId);
        voto.setEscolha(escolha);

        return votoRepository.save(voto);
    }

    public ResultadoDTO obterResultado(Long pautaId) {
        Pauta pauta = pautaRepository.findById(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pauta não encontrada"));

        List<Map<String, Object>> counts = votoRepository.countVotesByPautaId(pautaId);

        Map<String, Long> votosPorEscolha = new HashMap<>();
        long totalVotos = 0;

        for (Map<String, Object> count : counts) {
            String escolha = count.get("escolha").toString();
            Long total = (Long) count.get("total");
            votosPorEscolha.put(escolha, total);
            totalVotos += total;
        }

        return new ResultadoDTO(pautaId, pauta.getDescricao(), votosPorEscolha, totalVotos);
    }

    @Transactional
    public void deletarPauta(Long pautaId) {
        Pauta pauta = pautaRepository.findById(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pauta não encontrada"));

        votoRepository.deleteByPautaId(pautaId);
        sessaoRepository.deleteByPautaId(pautaId);
        pautaRepository.delete(pauta);
        pautaRepository.flush();
    }

    @Transactional
    public Sessao reabrirSessao(Long pautaId, Integer duracaoEmMinutos) {
        Pauta pauta = pautaRepository.findById(pautaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pauta não encontrada"));

        int minutos = (duracaoEmMinutos == null || duracaoEmMinutos <= 0) ? 1 : duracaoEmMinutos;

        return sessaoRepository.findByPautaId(pautaId)
                .map(sessao -> {
                    sessao.setDataFechamento(LocalDateTime.now().plusMinutes(minutos));
                    return sessaoRepository.save(sessao);
                })
                .orElseGet(() -> abrirSessao(pautaId, duracaoEmMinutos));
    }

    public List<PautaDTO> obterPautas() {
        return pautaRepository.findAll().stream()
                .map(pauta -> new PautaDTO(
                        pauta.getId(),
                        pauta.getDescricao(),
                        pauta.getSessao() != null ? pauta.getSessao().getDataFechamento() : null,
                        pauta.getSessao() != null && pauta.getSessao().estaAberta()))
                .toList();
    }
}
