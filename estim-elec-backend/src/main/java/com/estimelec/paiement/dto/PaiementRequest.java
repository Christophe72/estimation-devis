package com.estimelec.paiement.dto;

import com.estimelec.paiement.ModePaiement;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaiementRequest {

    @NotNull(message = "La factureId est obligatoire.")
    private Long factureId;

    @NotNull(message = "Le montant est obligatoire.")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0.")
    private BigDecimal montant;

    @NotNull(message = "La date de paiement est obligatoire.")
    private LocalDate datePaiement;

    @NotNull(message = "Le mode de paiement est obligatoire.")
    private ModePaiement modePaiement;

    @Size(max = 100, message = "La référence ne peut pas dépasser 100 caractères.")
    private String reference;

    @Size(max = 500, message = "Le commentaire ne peut pas dépasser 500 caractères.")
    private String commentaire;
}
