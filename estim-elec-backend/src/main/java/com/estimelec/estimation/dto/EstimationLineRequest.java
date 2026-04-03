package com.estimelec.estimation.dto;

import com.estimelec.estimation.TypeLigneEstimation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class EstimationLineRequest {

    @NotNull(message = "Le type de ligne est obligatoire.")
    private TypeLigneEstimation typeLigne;

    @NotBlank(message = "La désignation de la ligne est obligatoire.")
    @Size(max = 255, message = "La désignation de la ligne ne peut pas dépasser 255 caractères.")
    private String designation;

    @NotNull(message = "La quantité est obligatoire.")
    @DecimalMin(value = "0.01", message = "La quantité doit être supérieure à 0.")
    @Digits(integer = 10, fraction = 2, message = "La quantité est invalide.")
    private BigDecimal quantite;

    @Size(max = 50, message = "L'unité ne peut pas dépasser 50 caractères.")
    private String unite;

    @NotNull(message = "Le prix unitaire HT est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le prix unitaire HT doit être positif ou nul.")
    @Digits(integer = 10, fraction = 2, message = "Le prix unitaire HT est invalide.")
    private BigDecimal prixUnitaireHt;

    @NotNull(message = "Le taux TVA est obligatoire.")
    @DecimalMin(value = "0.00", inclusive = true, message = "Le taux TVA doit être positif ou nul.")
    @Digits(integer = 5, fraction = 2, message = "Le taux TVA est invalide.")
    private BigDecimal tauxTva;

    private Integer ordre;

    public TypeLigneEstimation getTypeLigne() {
        return typeLigne;
    }

    public void setTypeLigne(TypeLigneEstimation typeLigne) {
        this.typeLigne = typeLigne;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public BigDecimal getQuantite() {
        return quantite;
    }

    public void setQuantite(BigDecimal quantite) {
        this.quantite = quantite;
    }

    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public BigDecimal getPrixUnitaireHt() {
        return prixUnitaireHt;
    }

    public void setPrixUnitaireHt(BigDecimal prixUnitaireHt) {
        this.prixUnitaireHt = prixUnitaireHt;
    }

    public BigDecimal getTauxTva() {
        return tauxTva;
    }

    public void setTauxTva(BigDecimal tauxTva) {
        this.tauxTva = tauxTva;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }
}