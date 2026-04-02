package com.estimelec.ouvrage.dto;

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
public class OuvrageComponentResponse {

    private Long id;
    private Long articleId;
    private String articleCode;
    private String articleDesignation;
    private String articleCategorie;
    private String unite;
    private BigDecimal quantite;
    private BigDecimal prixAchatHt;
    private BigDecimal coutTotalHt;
}
