package com.cooperativa.votacao.service;

import com.cooperativa.votacao.model.Pauta;
import com.cooperativa.votacao.model.Sessao;
import com.cooperativa.votacao.repository.PautaRepository;
import com.cooperativa.votacao.repository.SessaoRepository;
import com.cooperativa.votacao.repository.VotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class VotacaoServiceTest {

    @Mock
    private PautaRepository pautaRepository;
    @Mock
    private SessaoRepository sessaoRepository;
    @Mock
    private VotoRepository votoRepository;
    @Mock
    private CpfValidatorService cpfValidatorService;

    @InjectMocks
    private VotacaoService votacaoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveCadastrarPautaComSucesso() {
        Pauta pauta = new Pauta();
        pauta.setDescricao("Pauta Teste");
        when(pautaRepository.save(any())).thenReturn(pauta);

        Pauta resultado = votacaoService.cadastrarPauta("Pauta Teste");

        assertNotNull(resultado);
        assertEquals("Pauta Teste", resultado.getDescricao());
        verify(pautaRepository, times(1)).save(any());
    }

    @Test
    void deveAbrirSessaoComTempoPadrao() {
        Pauta pauta = new Pauta();
        pauta.setId(1L);
        when(pautaRepository.findById(1L)).thenReturn(Optional.of(pauta));
        when(sessaoRepository.findByPautaId(1L)).thenReturn(Optional.empty());
        when(sessaoRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Sessao sessao = votacaoService.abrirSessao(1L, null);

        assertNotNull(sessao);
        assertTrue(sessao.getDataFechamento().isAfter(sessao.getDataAbertura()));
        assertTrue(sessao.getDataFechamento().isBefore(sessao.getDataAbertura().plusSeconds(61)));
    }
}
