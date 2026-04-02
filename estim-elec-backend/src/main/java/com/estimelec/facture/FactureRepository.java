package com.estimelec.facture;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {

    boolean existsByDevisId(Long devisId);

    Optional<Facture> findByDevisId(Long devisId);

    boolean existsByNumero(String numero);
}
