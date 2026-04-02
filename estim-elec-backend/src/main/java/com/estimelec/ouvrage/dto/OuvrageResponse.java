package com.estimelec.ouvrage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OuvrageResponse {

    private Long id;
    private String code;
    private String designation;
    private String categorie;
    private String unite;
    private BigDecimal tempsPoseHeures;
    private String description;
    private Boolean actif;
    private BigDecimal coutMaterielHt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OuvrageComponentResponse> composants;
}
