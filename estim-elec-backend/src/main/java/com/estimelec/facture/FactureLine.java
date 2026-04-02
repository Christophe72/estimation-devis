package com.estimelec.facture;

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
@Table(name = "facture_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "facture_id", nullable = false)
    private Facture facture;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;

    @Column(name = "quantite", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantite;

    @Column(name = "unite", nullable = false, length = 20)
    private String unite;

    @Column(name = "total_ligne_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalLigneHt;

    @Column(name = "ordre_affichage", nullable = false)
    private Integer ordreAffichage;

    @PrePersist
    public void prePersist() {
        if (totalLigneHt == null) {
            totalLigneHt = BigDecimal.ZERO;
        }
        if (ordreAffichage == null) {
            ordreAffichage = 0;
        }
    }
}
