package com.estimelec.ouvrage.dto;

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
public class OuvrageResponse {

    private Long id;
    private String code;
    private String designation;
    private String categorie;
    private String unite;
    private BigDecimal tempsPoseHeure;
    private String description;
    private Boolean actif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}