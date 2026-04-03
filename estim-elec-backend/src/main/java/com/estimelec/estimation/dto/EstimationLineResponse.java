package com.estimelec.estimation.dto;

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
    private Long ouvrageId;
    private String ouvrageCode;
    private String ouvrageDesignation;
    private BigDecimal quantite;
    private BigDecimal prixUnitaireHt;
    private BigDecimal totalHt;
    private Integer ordre;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
