package com.estimelec.ouvrage;

import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;

import java.util.List;

public interface OuvrageService {

    List<OuvrageResponse> findAll(Boolean actifOnly);

    OuvrageResponse findById(Long id);

    OuvrageResponse create(OuvrageRequest request);

    OuvrageResponse update(Long id, OuvrageRequest request);

    void delete(Long id);
}