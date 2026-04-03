package com.estimelec.estimation;

import com.estimelec.devis.dto.DevisResponse;
import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;

import java.util.List;

public interface EstimationService {

    EstimationResponse create(EstimationRequest request);

    List<EstimationResponse> findAll();

    EstimationResponse findById(Long id);

    EstimationResponse update(Long id, EstimationRequest request);

    void delete(Long id);

    DevisResponse convertirEnDevis(Long estimationId);
}
