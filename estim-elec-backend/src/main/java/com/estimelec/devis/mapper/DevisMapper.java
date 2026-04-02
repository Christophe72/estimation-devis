package com.estimelec.devis.mapper;

import com.estimelec.customer.Customer;
import com.estimelec.devis.Devis;
import com.estimelec.devis.DevisLine;
import com.estimelec.devis.dto.DevisLineRequest;
import com.estimelec.devis.dto.DevisLineResponse;
import com.estimelec.devis.dto.DevisRequest;
import com.estimelec.devis.dto.DevisResponse;
import com.estimelec.ouvrage.Ouvrage;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class DevisMapper {

    public Devis toEntity(DevisRequest request, Customer customer) {
        if (request == null) {
            return null;
        }

        return Devis.builder()
                .numero(normalize(request.getNumero()))
                .customer(customer)
                .chantierNom(normalize(request.getChantierNom()))
                .adresse(normalizeNullable(request.getAdresse()))
                .ville(normalizeNullable(request.getVille()))
                .codePostal(normalizeNullable(request.getCodePostal()))
                .typeChantier(normalize(request.getTypeChantier()))
                .statut(normalize(request.getStatut()))
                .tauxHoraire(defaultIfNull(request.getTauxHoraire()))
                .coefficientChantier(defaultPositive(request.getCoefficientChantier(), BigDecimal.valueOf(1.00)))
                .tauxFraisGeneraux(defaultIfNull(request.getTauxFraisGeneraux()))
                .tauxMarge(defaultIfNull(request.getTauxMarge()))
                .tauxTva(defaultIfNull(request.getTauxTva(), BigDecimal.valueOf(21.00)))
                .montantMaterielHt(BigDecimal.ZERO)
                .montantMainOeuvreHt(BigDecimal.ZERO)
                .montantFraisGenerauxHt(BigDecimal.ZERO)
                .montantMargeHt(BigDecimal.ZERO)
                .montantTotalHt(BigDecimal.ZERO)
                .montantTva(BigDecimal.ZERO)
                .montantTotalTtc(BigDecimal.ZERO)
                .lines(new ArrayList<>())
                .build();
    }

    public void updateEntity(Devis devis, DevisRequest request, Customer customer) {
        devis.setNumero(normalize(request.getNumero()));
        devis.setCustomer(customer);
        devis.setChantierNom(normalize(request.getChantierNom()));
        devis.setAdresse(normalizeNullable(request.getAdresse()));
        devis.setVille(normalizeNullable(request.getVille()));
        devis.setCodePostal(normalizeNullable(request.getCodePostal()));
        devis.setTypeChantier(normalize(request.getTypeChantier()));
        devis.setStatut(normalize(request.getStatut()));
        devis.setTauxHoraire(defaultIfNull(request.getTauxHoraire()));
        devis.setCoefficientChantier(defaultPositive(request.getCoefficientChantier(), BigDecimal.valueOf(1.00)));
        devis.setTauxFraisGeneraux(defaultIfNull(request.getTauxFraisGeneraux()));
        devis.setTauxMarge(defaultIfNull(request.getTauxMarge()));
        devis.setTauxTva(defaultIfNull(request.getTauxTva(), BigDecimal.valueOf(21.00)));
    }

    public DevisLine toLineEntity(DevisLineRequest request, Devis devis, Ouvrage ouvrage) {
        if (request == null) {
            return null;
        }

        BigDecimal quantite = scale(defaultIfNull(request.getQuantite()));
        BigDecimal coutMaterielUnitaire = scale(defaultIfNull(request.getCoutMaterielUnitaireHt()));
        BigDecimal coutMainOeuvreUnitaire = scale(defaultIfNull(request.getCoutMainOeuvreUnitaireHt()));

        BigDecimal totalLigne = scale(quantite.multiply(coutMaterielUnitaire.add(coutMainOeuvreUnitaire)));

        return DevisLine.builder()
                .devis(devis)
                .ouvrage(ouvrage)
                .typeLigne(normalize(request.getTypeLigne()))
                .designation(normalize(request.getDesignation()))
                .quantite(quantite)
                .unite(normalize(request.getUnite()))
                .tempsUnitaireHeures(scale(defaultIfNull(request.getTempsUnitaireHeures())))
                .coutMaterielUnitaireHt(coutMaterielUnitaire)
                .coutMainOeuvreUnitaireHt(coutMainOeuvreUnitaire)
                .totalLigneHt(totalLigne)
                .ordreAffichage(request.getOrdreAffichage() == null ? 0 : request.getOrdreAffichage())
                .build();
    }

    public DevisResponse toResponse(Devis devis) {
        if (devis == null) {
            return null;
        }

        List<DevisLineResponse> lines = devis.getLines() == null
                ? List.of()
                : devis.getLines().stream().map(this::toLineResponse).toList();

        return DevisResponse.builder()
                .id(devis.getId())
                .numero(devis.getNumero())
                .customerId(devis.getCustomer() != null ? devis.getCustomer().getId() : null)
                .customerNom(devis.getCustomer() != null ? devis.getCustomer().getNom() : null)
                .chantierNom(devis.getChantierNom())
                .adresse(devis.getAdresse())
                .ville(devis.getVille())
                .codePostal(devis.getCodePostal())
                .typeChantier(devis.getTypeChantier())
                .statut(devis.getStatut())
                .tauxHoraire(devis.getTauxHoraire())
                .coefficientChantier(devis.getCoefficientChantier())
                .tauxFraisGeneraux(devis.getTauxFraisGeneraux())
                .tauxMarge(devis.getTauxMarge())
                .tauxTva(devis.getTauxTva())
                .montantMaterielHt(devis.getMontantMaterielHt())
                .montantMainOeuvreHt(devis.getMontantMainOeuvreHt())
                .montantFraisGenerauxHt(devis.getMontantFraisGenerauxHt())
                .montantMargeHt(devis.getMontantMargeHt())
                .montantTotalHt(devis.getMontantTotalHt())
                .montantTva(devis.getMontantTva())
                .montantTotalTtc(devis.getMontantTotalTtc())
                .createdAt(devis.getCreatedAt())
                .updatedAt(devis.getUpdatedAt())
                .lines(lines)
                .build();
    }

    public DevisLineResponse toLineResponse(DevisLine line) {
        return DevisLineResponse.builder()
                .id(line.getId())
                .devisId(line.getDevis() != null ? line.getDevis().getId() : null)
                .ouvrageId(line.getOuvrage() != null ? line.getOuvrage().getId() : null)
                .ouvrageDesignation(line.getOuvrage() != null ? line.getOuvrage().getDesignation() : null)
                .typeLigne(line.getTypeLigne())
                .designation(line.getDesignation())
                .quantite(line.getQuantite())
                .unite(line.getUnite())
                .tempsUnitaireHeures(line.getTempsUnitaireHeures())
                .coutMaterielUnitaireHt(line.getCoutMaterielUnitaireHt())
                .coutMainOeuvreUnitaireHt(line.getCoutMainOeuvreUnitaireHt())
                .totalLigneHt(line.getTotalLigneHt())
                .ordreAffichage(line.getOrdreAffichage())
                .build();
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : scale(value);
    }

    private BigDecimal defaultIfNull(BigDecimal value, BigDecimal defaultValue) {
        return value == null ? scale(defaultValue) : scale(value);
    }

    private BigDecimal defaultPositive(BigDecimal value, BigDecimal defaultValue) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            return scale(defaultValue);
        }
        return scale(value);
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
