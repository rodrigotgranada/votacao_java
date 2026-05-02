package com.cooperativa.votacao.controller;

import com.cooperativa.votacao.dto.PautaDTO;
import com.cooperativa.votacao.dto.ResultadoDTO;
import com.cooperativa.votacao.model.Pauta;
import com.cooperativa.votacao.model.Sessao;
import com.cooperativa.votacao.model.Voto;
import com.cooperativa.votacao.service.VotacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pautas")
@CrossOrigin(origins = "*")

@RequiredArgsConstructor
public class PautaController {

    private final VotacaoService votacaoService;

    @PostMapping
    public ResponseEntity<Pauta> cadastrarPauta(@RequestBody Map<String, String> request) {
        String descricao = request.get("descricao");
        return ResponseEntity.ok(votacaoService.cadastrarPauta(descricao));
    }

    @PostMapping("/{id}/abrir-sessao")
    public ResponseEntity<Sessao> abrirSessao(
            @PathVariable Long id,
            @RequestParam(required = false) Integer duracao) {
        return ResponseEntity.ok(votacaoService.abrirSessao(id, duracao));
    }

    @PostMapping("/{id}/votos")
    public ResponseEntity<Voto> votar(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String associadoId = request.get("associadoId");
        Voto.EscolhaVoto escolha = Voto.EscolhaVoto.valueOf(request.get("escolha").toUpperCase());
        return ResponseEntity.ok(votacaoService.votar(id, associadoId, escolha));
    }

    @GetMapping("/{id}/resultado")
    public ResponseEntity<ResultadoDTO> obterResultado(@PathVariable Long id) {
        return ResponseEntity.ok(votacaoService.obterResultado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPauta(@PathVariable Long id) {
        votacaoService.deletarPauta(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reabrir-sessao")
    public ResponseEntity<Sessao> reabrirSessao(
            @PathVariable Long id,
            @RequestParam(required = false) Integer duracao) {
        return ResponseEntity.ok(votacaoService.reabrirSessao(id, duracao));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> obterPautas() {
        List<PautaDTO> pautas = votacaoService.obterPautas();
        Map<String, Object> response = new HashMap<>();
        response.put("mensagem", "Pautas recuperadas com sucesso!");
        response.put("total", pautas.size());
        response.put("dados", pautas);
        return ResponseEntity.ok(response);
    }
}
