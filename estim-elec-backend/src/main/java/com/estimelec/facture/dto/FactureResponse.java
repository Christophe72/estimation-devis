package com.estimelec.facture.dto;

import com.estimelec.facture.StatutFacture;
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
public class FactureResponse {

    private Long id;
    private String numero;

    private Long devisId;
    private Long customerId;
    private String customerNom;

    private String chantierNom;
    private String adresse;
    private String ville;
    private String codePostal;

    private StatutFacture statut;

    private BigDecimal montantTotalHt;
    private BigDecimal montantTva;
    private BigDecimal montantTotalTtc;
    private BigDecimal totalPaye;
    private BigDecimal resteAPayer;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<FactureLineResponse> lines = new ArrayList<>();
}
