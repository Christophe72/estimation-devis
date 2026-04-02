package com.estimelec.devis;

import com.estimelec.devis.dto.DevisRequest;
import com.estimelec.devis.dto.DevisResponse;

import java.util.List;

public interface DevisService {

    List<DevisResponse> findAll(Long customerId, String statut);

    DevisResponse findById(Long id);

    DevisResponse create(DevisRequest request);

    DevisResponse update(Long id, DevisRequest request);

    void delete(Long id);
}
