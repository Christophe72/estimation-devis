package com.estimelec.devis;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevisLineRepository extends JpaRepository<DevisLine, Long> {

    List<DevisLine> findByDevisIdOrderByOrdreAffichageAsc(Long devisId);

    void deleteByDevisId(Long devisId);
}
