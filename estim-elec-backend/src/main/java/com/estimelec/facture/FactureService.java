package com.estimelec.facture;

import com.estimelec.facture.dto.FactureResponse;

import java.util.List;

public interface FactureService {

    List<FactureResponse> findAll();

    FactureResponse findById(Long id);

    FactureResponse convertFromDevis(Long devisId);
}
