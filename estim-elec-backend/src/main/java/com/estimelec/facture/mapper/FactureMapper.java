package com.estimelec.facture.mapper;

import com.estimelec.facture.Facture;
import com.estimelec.facture.FactureLine;
import com.estimelec.facture.dto.FactureLineResponse;
import com.estimelec.facture.dto.FactureResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FactureMapper {

    public FactureResponse toResponse(Facture facture) {
        List<FactureLineResponse> lines = facture.getLines() == null
                ? List.of()
                : facture.getLines().stream()
                .map(this::toLineResponse)
                .toList();

        return FactureResponse.builder()
                .id(facture.getId())
                .numero(facture.getNumero())
                .devisId(facture.getDevis() != null ? facture.getDevis().getId() : null)
                .customerId(facture.getCustomer() != null ? facture.getCustomer().getId() : null)
                .customerNom(facture.getCustomer() != null ? facture.getCustomer().getNom() : null)
                .chantierNom(facture.getChantierNom())
                .adresse(facture.getAdresse())
                .ville(facture.getVille())
                .codePostal(facture.getCodePostal())
                .statut(facture.getStatut())
                .montantTotalHt(facture.getMontantTotalHt())
                .montantTva(facture.getMontantTva())
                .montantTotalTtc(facture.getMontantTotalTtc())
                .createdAt(facture.getCreatedAt())
                .updatedAt(facture.getUpdatedAt())
                .lines(lines)
                .build();
    }

    public FactureLineResponse toLineResponse(FactureLine line) {
        return FactureLineResponse.builder()
                .id(line.getId())
                .factureId(line.getFacture() != null ? line.getFacture().getId() : null)
                .designation(line.getDesignation())
                .quantite(line.getQuantite())
                .unite(line.getUnite())
                .totalLigneHt(line.getTotalLigneHt())
                .ordreAffichage(line.getOrdreAffichage())
                .build();
    }
}
