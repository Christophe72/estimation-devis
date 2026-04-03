package com.estimelec.estimation.dto;

import com.estimelec.estimation.TypeLigneEstimation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimationLineResponse {

    private Long id;
    private TypeLigneEstimation typeLigne;
    private String designation;
    private BigDecimal quantite;
    private String unite;
    private BigDecimal prixUnitaireHt;
    private BigDecimal tauxTva;
    private BigDecimal totalHt;
    private BigDecimal totalTva;
    private BigDecimal totalTtc;
    private Integer ordre;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
