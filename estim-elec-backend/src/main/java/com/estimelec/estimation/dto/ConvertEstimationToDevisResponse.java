package com.estimelec.estimation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConvertEstimationToDevisResponse {

    private Long devisId;
    private String numero;
    private String statut;
    private String message;
}
