package com.estimelec.estimation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
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

    @NotNull(message = "Le ouvrageId est obligatoire.")
    private Long ouvrageId;

    @NotNull(message = "La quantite est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = false, message = "La quantite doit etre superieure a 0.")
    @Digits(integer = 10, fraction = 2, message = "La quantite doit contenir au maximum 10 chiffres avant la virgule et 2 apres.")
    private BigDecimal quantite;

    @NotNull(message = "Le prixUnitaireHt est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le prix unitaire HT doit etre superieur ou egal a 0.")
    @Digits(integer = 10, fraction = 2, message = "Le prixUnitaireHt doit contenir au maximum 10 chiffres avant la virgule et 2 apres.")
    private BigDecimal prixUnitaireHt;

    private Integer ordre;
}
