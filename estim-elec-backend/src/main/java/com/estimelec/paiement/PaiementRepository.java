package com.estimelec.paiement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {

    List<Paiement> findByFactureIdOrderByDatePaiementDescIdDesc(Long factureId);

    List<Paiement> findByFactureId(Long factureId);

    long countByFactureId(Long factureId);

    default BigDecimal sumByFactureId(Long factureId) {
        return findByFactureId(factureId).stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
