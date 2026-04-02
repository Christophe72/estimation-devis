package com.estimelec.paiement.mapper;

import com.estimelec.facture.Facture;
import com.estimelec.paiement.Paiement;
import com.estimelec.paiement.dto.PaiementRequest;
import com.estimelec.paiement.dto.PaiementResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaiementMapper {

    public Paiement toEntity(PaiementRequest request, Facture facture) {
        if (request == null) {
            return null;
        }

        return Paiement.builder()
                .facture(facture)
                .montant(request.getMontant())
                .datePaiement(request.getDatePaiement())
                .modePaiement(request.getModePaiement())
                .reference(normalizeNullable(request.getReference()))
                .commentaire(normalizeNullable(request.getCommentaire()))
                .build();
    }

    public PaiementResponse toResponse(Paiement paiement, BigDecimal totalPaye, BigDecimal resteAPayer) {
        return PaiementResponse.builder()
                .id(paiement.getId())
                .factureId(paiement.getFacture() != null ? paiement.getFacture().getId() : null)
                .factureNumero(paiement.getFacture() != null ? paiement.getFacture().getNumero() : null)
                .montant(paiement.getMontant())
                .datePaiement(paiement.getDatePaiement())
                .modePaiement(paiement.getModePaiement())
                .reference(paiement.getReference())
                .commentaire(paiement.getCommentaire())
                .createdAt(paiement.getCreatedAt())
                .updatedAt(paiement.getUpdatedAt())
                .totalPayeFacture(totalPaye)
                .resteAPayerFacture(resteAPayer)
                .statutFacture(paiement.getFacture() != null && paiement.getFacture().getStatut() != null
                        ? paiement.getFacture().getStatut().name()
                        : null)
                .build();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
