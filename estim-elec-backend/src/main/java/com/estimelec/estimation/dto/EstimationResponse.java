package com.estimelec.estimation.dto;

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
public class EstimationResponse {

    private Long id;
    private String designation;
    private Long customerId;
    private String customerNom;
    private String description;
    private BigDecimal totalHt;
    private BigDecimal totalTva;
    private BigDecimal totalTtc;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<EstimationLineResponse> lines;
}
