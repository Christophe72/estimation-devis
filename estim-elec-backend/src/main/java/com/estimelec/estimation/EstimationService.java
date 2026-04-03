package com.estimelec.estimation;

import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;

import java.util.List;

public interface EstimationService {

    List<EstimationResponse> findAll(Long customerId);

    EstimationResponse findById(Long id);

    EstimationResponse create(EstimationRequest request);

    EstimationResponse update(Long id, EstimationRequest request);

    void delete(Long id);
}