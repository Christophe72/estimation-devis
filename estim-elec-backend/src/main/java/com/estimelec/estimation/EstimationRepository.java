package com.estimelec.estimation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstimationRepository extends JpaRepository<Estimation, Long> {

    List<Estimation> findAllByCustomerIdOrderByIdDesc(Long customerId);
}
