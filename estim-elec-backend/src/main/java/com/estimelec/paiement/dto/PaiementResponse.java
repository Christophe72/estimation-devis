package com.estimelec.paiement.dto;

import com.estimelec.paiement.ModePaiement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaiementResponse {

    private Long id;
    private Long factureId;
    private String factureNumero;

    private BigDecimal montant;
    private LocalDate datePaiement;
    private ModePaiement modePaiement;
    private String reference;
    private String commentaire;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private BigDecimal totalPayeFacture;
    private BigDecimal resteAPayerFacture;
    private String statutFacture;
}
