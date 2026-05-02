package com.cooperativa.votacao.repository;

import com.cooperativa.votacao.model.Voto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {
    
    boolean existsByPautaIdAndAssociadoId(Long pautaId, String associadoId);

    @Modifying
    @Transactional
    void deleteByPautaId(Long pautaId);

    @Query("SELECT v.escolha as escolha, COUNT(v) as total FROM Voto v WHERE v.pautaId = :pautaId GROUP BY v.escolha")
    List<Map<String, Object>> countVotesByPautaId(Long pautaId);
}

