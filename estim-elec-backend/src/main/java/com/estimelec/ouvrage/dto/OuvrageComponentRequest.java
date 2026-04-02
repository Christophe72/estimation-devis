package com.estimelec.ouvrage.dto;

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
public class OuvrageComponentRequest {

    @NotNull(message = "L'id de l'article est obligatoire.")
    private Long articleId;

    @NotNull(message = "La quantité est obligatoire.")
    @DecimalMin(value = "0.001", inclusive = true, message = "La quantité doit être strictement positive.")
    @Digits(integer = 10, fraction = 3, message = "La quantité doit avoir au maximum 3 décimales.")
    private BigDecimal quantite;
}
