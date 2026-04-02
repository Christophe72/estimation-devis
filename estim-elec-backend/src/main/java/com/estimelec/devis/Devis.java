package com.estimelec.devis;

import com.estimelec.customer.Customer;
import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Devis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero", nullable = false, unique = true, length = 50)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "chantier_nom", nullable = false, length = 255)
    private String chantierNom;

    @Column(name = "adresse", length = 255)
    private String adresse;

    @Column(name = "ville", length = 120)
    private String ville;

    @Column(name = "code_postal", length = 20)
    private String codePostal;

    @Column(name = "type_chantier", nullable = false, length = 50)
    private String typeChantier;

    @Column(name = "statut", nullable = false, length = 50)
    private String statut;

    @Column(name = "taux_horaire", nullable = false, precision = 12, scale = 2)
    private BigDecimal tauxHoraire;

    @Column(name = "coefficient_chantier", nullable = false, precision = 8, scale = 2)
    private BigDecimal coefficientChantier;

    @Column(name = "taux_frais_generaux", nullable = false, precision = 5, scale = 2)
    private BigDecimal tauxFraisGeneraux;

    @Column(name = "taux_marge", nullable = false, precision = 5, scale = 2)
    private BigDecimal tauxMarge;

    @Column(name = "taux_tva", nullable = false, precision = 5, scale = 2)
    private BigDecimal tauxTva;

    @Column(name = "montant_materiel_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantMaterielHt;

    @Column(name = "montant_main_oeuvre_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantMainOeuvreHt;

    @Column(name = "montant_frais_generaux_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantFraisGenerauxHt;

    @Column(name = "montant_marge_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantMargeHt;

    @Column(name = "montant_total_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTotalHt;

    @Column(name = "montant_tva", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTva;

    @Column(name = "montant_total_ttc", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTotalTtc;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DevisLine> lines = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }

        if (coefficientChantier == null) {
            coefficientChantier = BigDecimal.valueOf(1.00);
        }
        if (tauxFraisGeneraux == null) {
            tauxFraisGeneraux = BigDecimal.ZERO;
        }
        if (tauxMarge == null) {
            tauxMarge = BigDecimal.ZERO;
        }
        if (tauxTva == null) {
            tauxTva = BigDecimal.valueOf(21.00);
        }
        if (montantMaterielHt == null) {
            montantMaterielHt = BigDecimal.ZERO;
        }
        if (montantMainOeuvreHt == null) {
            montantMainOeuvreHt = BigDecimal.ZERO;
        }
        if (montantFraisGenerauxHt == null) {
            montantFraisGenerauxHt = BigDecimal.ZERO;
        }
        if (montantMargeHt == null) {
            montantMargeHt = BigDecimal.ZERO;
        }
        if (montantTotalHt == null) {
            montantTotalHt = BigDecimal.ZERO;
        }
        if (montantTva == null) {
            montantTva = BigDecimal.ZERO;
        }
        if (montantTotalTtc == null) {
            montantTotalTtc = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
