package com.estimelec.ouvrage.mapper;

import com.estimelec.ouvrage.Ouvrage;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import org.springframework.stereotype.Component;

@Component
public class OuvrageMapper {

    public OuvrageResponse toResponse(Ouvrage ouvrage) {
        return OuvrageResponse.builder()
                .id(ouvrage.getId())
                .code(ouvrage.getCode())
                .designation(ouvrage.getDesignation())
                .categorie(ouvrage.getCategorie())
                .unite(ouvrage.getUnite())
                .tempsPoseHeure(ouvrage.getTempsPoseHeure())
                .description(ouvrage.getDescription())
                .actif(ouvrage.getActif())
                .createdAt(ouvrage.getCreatedAt())
                .updatedAt(ouvrage.getUpdatedAt())
                .build();
    }
}