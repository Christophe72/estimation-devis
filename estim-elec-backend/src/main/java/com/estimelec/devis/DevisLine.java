package com.estimelec.devis;

import com.estimelec.ouvrage.Ouvrage;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "devis_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevisLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "devis_id", nullable = false)
    private Devis devis;

    @Column(name = "type_ligne", nullable = false, length = 50)
    private String typeLigne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ouvrage_id")
    private Ouvrage ouvrage;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;

    @Column(name = "quantite", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantite;

    @Column(name = "unite", nullable = false, length = 20)
    private String unite;

    @Column(name = "temps_unitaire_heures", nullable = false, precision = 8, scale = 2)
    private BigDecimal tempsUnitaireHeures;

    @Column(name = "cout_materiel_unitaire_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal coutMaterielUnitaireHt;

    @Column(name = "cout_main_oeuvre_unitaire_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal coutMainOeuvreUnitaireHt;

    @Column(name = "total_ligne_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalLigneHt;

    @Column(name = "ordre_affichage", nullable = false)
    private Integer ordreAffichage;

    @PrePersist
    public void prePersist() {
        if (tempsUnitaireHeures == null) {
            tempsUnitaireHeures = BigDecimal.ZERO;
        }
        if (coutMaterielUnitaireHt == null) {
            coutMaterielUnitaireHt = BigDecimal.ZERO;
        }
        if (coutMainOeuvreUnitaireHt == null) {
            coutMainOeuvreUnitaireHt = BigDecimal.ZERO;
        }
        if (totalLigneHt == null) {
            totalLigneHt = BigDecimal.ZERO;
        }
        if (ordreAffichage == null) {
            ordreAffichage = 0;
        }
    }
}
