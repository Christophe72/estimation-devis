package com.estimelec.facture;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FactureLineRepository extends JpaRepository<FactureLine, Long> {
}
