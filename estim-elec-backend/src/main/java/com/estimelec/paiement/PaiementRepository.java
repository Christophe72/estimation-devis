package com.estimelec.paiement;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findByFactureIdOrderByDatePaiementDescIdDesc(Long factureId);

    List<Paiement> findByFactureId(Long factureId);

    long countByFactureId(Long factureId);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM Paiement p WHERE p.facture.id = :factureId")
    BigDecimal sumMontantByFactureId(@Param("factureId") Long factureId);

    default BigDecimal sumByFactureId(Long factureId) {
        return findByFactureId(factureId).stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
