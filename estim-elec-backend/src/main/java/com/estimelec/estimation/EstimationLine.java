package com.estimelec.estimation;

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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estimation_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimationLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estimation_id", nullable = false)
    private Estimation estimation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ouvrage_id")
    private Ouvrage ouvrage;

    @Column(name = "quantite", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantite;

    @Column(name = "prix_unitaire_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal prixUnitaireHt;

    @Column(name = "taux_tva", nullable = false, precision = 5, scale = 2)
    private BigDecimal tauxTva;

    @Column(name = "total_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalHt;

    @Column(name = "ordre", nullable = false)
    private Integer ordre;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        applyDefaults();
    }

    @PreUpdate
    public void preUpdate() {
        applyDefaults();
    }

    private void applyDefaults() {
        if (this.quantite == null) {
            this.quantite = BigDecimal.ZERO;
        }
        if (this.prixUnitaireHt == null) {
            this.prixUnitaireHt = BigDecimal.ZERO;
        }
        if (this.tauxTva == null) {
            this.tauxTva = new BigDecimal("21.00");
        }
        if (this.totalHt == null) {
            this.totalHt = BigDecimal.ZERO;
        }
        if (this.ordre == null) {
            this.ordre = 0;
        }
    }
}
