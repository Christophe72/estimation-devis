package com.estimelec.estimation;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EstimationRepository extends JpaRepository<Estimation, Long> {

    @EntityGraph(attributePaths = "lines")
    List<Estimation> findAllByCustomerIdOrderByIdDesc(Long customerId);

    @Override
    @EntityGraph(attributePaths = "lines")
    List<Estimation> findAll();

    @Override
    @EntityGraph(attributePaths = "lines")
    Optional<Estimation> findById(Long id);
}
