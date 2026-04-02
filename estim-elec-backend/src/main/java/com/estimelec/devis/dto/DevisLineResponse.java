package com.estimelec.devis.dto;

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
public class DevisLineResponse {

    private Long id;
    private Long devisId;
    private Long ouvrageId;
    private String ouvrageDesignation;

    private String typeLigne;
    private String designation;
    private BigDecimal quantite;
    private String unite;
    private BigDecimal tempsUnitaireHeures;
    private BigDecimal coutMaterielUnitaireHt;
    private BigDecimal coutMainOeuvreUnitaireHt;
    private BigDecimal totalLigneHt;
    private Integer ordreAffichage;
}
