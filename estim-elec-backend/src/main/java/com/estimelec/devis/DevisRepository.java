package com.estimelec.devis;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DevisRepository extends JpaRepository<Devis, Long> {

    List<Devis> findByCustomerId(Long customerId);

    List<Devis> findByStatut(String statut);

    List<Devis> findByCustomerIdAndStatut(Long customerId, String statut);

    Optional<Devis> findByNumero(String numero);

    boolean existsByNumero(String numero);
}
