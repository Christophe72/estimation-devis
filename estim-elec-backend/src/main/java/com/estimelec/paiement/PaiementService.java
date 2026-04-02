package com.estimelec.paiement;

import com.estimelec.paiement.dto.PaiementRequest;
import com.estimelec.paiement.dto.PaiementResponse;

import java.util.List;

public interface PaiementService {

    List<PaiementResponse> findAll(Long factureId);

    PaiementResponse findById(Long id);

    PaiementResponse create(PaiementRequest request);

    void delete(Long id);
}
