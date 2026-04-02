package com.estimelec.facture.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureLineResponse {

    private Long id;
    private Long factureId;
    private String designation;
    private BigDecimal quantite;
    private String unite;
    private BigDecimal totalLigneHt;
    private Integer ordreAffichage;
}
