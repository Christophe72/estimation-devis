package com.estimelec.article.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
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
public class ArticleRequest {

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

    @NotNull(message = "Le prix d'achat HT est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le prix d'achat HT doit être positif ou nul.")
    @Digits(integer = 10, fraction = 2, message = "Le prix d'achat HT doit avoir au maximum 2 décimales.")
    private BigDecimal prixAchatHt;

    @NotNull(message = "La marge par défaut est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "La marge par défaut doit être positive ou nulle.")
    @Digits(integer = 3, fraction = 2, message = "La marge par défaut doit avoir au maximum 2 décimales.")
    private BigDecimal margeParDefaut;

    @NotNull(message = "Le statut actif est obligatoire.")
    private Boolean actif;
}
