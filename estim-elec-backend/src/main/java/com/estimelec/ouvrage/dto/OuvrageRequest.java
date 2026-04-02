package com.estimelec.ouvrage.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OuvrageRequest {

    @NotBlank(message = "Le code est obligatoire.")
    @Size(max = 50, message = "Le code ne peut pas dépasser 50 caractères.")
    private String code;

    @NotBlank(message = "La désignation est obligatoire.")
    @Size(max = 255, message = "La désignation ne peut pas dépasser 255 caractères.")
    private String designation;

    @NotBlank(message = "La catégorie est obligatoire.")
    @Size(max = 100, message = "La catégorie ne peut pas dépasser 100 caractères.")
    private String categorie;

    @NotBlank(message = "L'unité est obligatoire.")
    @Size(max = 20, message = "L'unité ne peut pas dépasser 20 caractères.")
    private String unite;

    @NotNull(message = "Le temps de pose est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le temps de pose doit être positif ou nul.")
    @Digits(integer = 6, fraction = 2, message = "Le temps de pose doit avoir au maximum 2 décimales.")
    private BigDecimal tempsPoseHeures;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères.")
    private String description;

    @NotNull(message = "Le statut actif est obligatoire.")
    private Boolean actif;

    @NotEmpty(message = "Un ouvrage doit contenir au moins un composant.")
    @Valid
    private List<OuvrageComponentRequest> composants;
}
