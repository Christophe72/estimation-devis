package com.estimelec.ouvrage.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
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
public class OuvrageRequest {

    @NotBlank(message = "Le code est obligatoire.")
    private String code;

    @NotBlank(message = "La designation est obligatoire.")
    private String designation;

    @NotBlank(message = "La categorie est obligatoire.")
    private String categorie;

    @NotBlank(message = "L'unite est obligatoire.")
    private String unite;

    @NotNull(message = "Le tempsPoseHeure est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le tempsPoseHeure doit etre superieur ou egal a 0.")
    @Digits(integer = 10, fraction = 2, message = "Le tempsPoseHeure doit contenir au maximum 10 chiffres avant la virgule et 2 apres.")
    private BigDecimal tempsPoseHeure;

    private String description;

    private Boolean actif;
}