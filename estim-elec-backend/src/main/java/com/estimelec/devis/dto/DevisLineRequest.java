package com.estimelec.devis.dto;

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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevisLineRequest {

    @NotBlank(message = "Le type de ligne est obligatoire.")
    @Size(max = 50, message = "Le type de ligne ne peut pas dépasser 50 caractères.")
    private String typeLigne;

    private Long ouvrageId;

    @NotBlank(message = "La désignation est obligatoire.")
    @Size(max = 255, message = "La désignation ne peut pas dépasser 255 caractères.")
    private String designation;

    @NotNull(message = "La quantité est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = false, message = "La quantité doit être supérieure à 0.")
    private BigDecimal quantite;

    @NotBlank(message = "L'unité est obligatoire.")
    @Size(max = 20, message = "L'unité ne peut pas dépasser 20 caractères.")
    private String unite;

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le temps unitaire doit être supérieur ou égal à 0.")
    private BigDecimal tempsUnitaireHeures = BigDecimal.ZERO;

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le coût matériel unitaire doit être supérieur ou égal à 0.")
    private BigDecimal coutMaterielUnitaireHt = BigDecimal.ZERO;

    @Builder.Default
    @DecimalMin(value = "0.00", message = "Le coût main d'oeuvre unitaire doit être supérieur ou égal à 0.")
    private BigDecimal coutMainOeuvreUnitaireHt = BigDecimal.ZERO;

    @Builder.Default
    private Integer ordreAffichage = 0;
}
