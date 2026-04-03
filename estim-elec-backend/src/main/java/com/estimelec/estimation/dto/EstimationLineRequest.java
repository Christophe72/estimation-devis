package com.estimelec.estimation.dto;

import com.estimelec.estimation.TypeLigneEstimation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class EstimationLineRequest {

    @NotNull(message = "Le typeLigne est obligatoire.")
    private TypeLigneEstimation typeLigne;

    @NotBlank(message = "La designation est obligatoire.")
    private String designation;

    @NotNull(message = "La quantite est obligatoire.")
    @DecimalMin(value = "0.01", message = "La quantite doit être > 0.")
    private BigDecimal quantite;

    private String unite;

    @NotNull(message = "Le prixUnitaireHt est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le prixUnitaireHt doit être >= 0.")
    private BigDecimal prixUnitaireHt;

    @NotNull(message = "Le tauxTva est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le tauxTva doit être >= 0.")
    private BigDecimal tauxTva;

    private Integer ordre;
}
