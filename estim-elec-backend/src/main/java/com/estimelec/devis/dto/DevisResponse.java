package com.estimelec.devis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevisResponse {

    private Long id;
    private String numero;

    private Long customerId;
    private String customerNom;

    private String chantierNom;
    private String adresse;
    private String ville;
    private String codePostal;
    private String typeChantier;
    private String statut;

    private BigDecimal tauxHoraire;
    private BigDecimal coefficientChantier;
    private BigDecimal tauxFraisGeneraux;
    private BigDecimal tauxMarge;
    private BigDecimal tauxTva;

    private BigDecimal montantMaterielHt;
    private BigDecimal montantMainOeuvreHt;
    private BigDecimal montantFraisGenerauxHt;
    private BigDecimal montantMargeHt;
    private BigDecimal montantTotalHt;
    private BigDecimal montantTva;
    private BigDecimal montantTotalTtc;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<DevisLineResponse> lines = new ArrayList<>();
}
