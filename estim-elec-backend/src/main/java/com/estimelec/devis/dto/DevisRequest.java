package com.estimelec.devis.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevisRequest {

    @NotBlank(message = "Le numéro du devis est obligatoire.")
    @Size(max = 50, message = "Le numéro du devis ne peut pas dépasser 50 caractères.")
    private String numero;

    @NotNull(message = "Le customerId est obligatoire.")
    private Long customerId;

    @NotBlank(message = "Le nom du chantier est obligatoire.")
    @Size(max = 255, message = "Le nom du chantier ne peut pas dépasser 255 caractères.")
    private String chantierNom;

    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères.")
    private String adresse;

    @Size(max = 120, message = "La ville ne peut pas dépasser 120 caractères.")
    private String ville;

    @Size(max = 20, message = "Le code postal ne peut pas dépasser 20 caractères.")
    private String codePostal;

    @NotBlank(message = "Le type de chantier est obligatoire.")
    @Size(max = 50, message = "Le type de chantier ne peut pas dépasser 50 caractères.")
    private String typeChantier;

    @NotBlank(message = "Le statut est obligatoire.")
    @Size(max = 50, message = "Le statut ne peut pas dépasser 50 caractères.")
    private String statut;

    @NotNull(message = "Le taux horaire est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = false, message = "Le taux horaire doit être supérieur à 0.")
    private BigDecimal tauxHoraire;

    @Builder.Default
    @DecimalMin(value = "0.00", inclusive = false, message = "Le coefficient chantier doit être supérieur à 0.")
    private BigDecimal coefficientChantier = BigDecimal.valueOf(1.00);

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le taux de frais généraux doit être supérieur ou égal à 0.")
    private BigDecimal tauxFraisGeneraux = BigDecimal.ZERO;

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le taux de marge doit être supérieur ou égal à 0.")
    private BigDecimal tauxMarge = BigDecimal.ZERO;

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le taux de TVA doit être supérieur ou égal à 0.")
    private BigDecimal tauxTva = BigDecimal.valueOf(21.00);

    @Valid
    @Builder.Default
    private List<DevisLineRequest> lines = new ArrayList<>();
}
