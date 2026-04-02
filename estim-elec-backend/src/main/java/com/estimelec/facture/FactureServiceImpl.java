package com.estimelec.facture;

import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.devis.Devis;
import com.estimelec.devis.DevisLine;
import com.estimelec.devis.DevisRepository;
import com.estimelec.facture.dto.FactureResponse;
import com.estimelec.facture.mapper.FactureMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final DevisRepository devisRepository;
    private final FactureMapper factureMapper;

    @Override
    @Transactional(readOnly = true)
    public List<FactureResponse> findAll() {
        return factureRepository.findAll().stream()
                .sorted(Comparator.comparing(Facture::getId).reversed())
                .map(factureMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FactureResponse findById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture introuvable avec l'id : " + id));

        return factureMapper.toResponse(facture);
    }

    @Override
    public FactureResponse convertFromDevis(Long devisId) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec l'id : " + devisId));

        if (!"ACCEPTE".equalsIgnoreCase(devis.getStatut())) {
            throw new BadRequestException("Seul un devis avec le statut ACCEPTE peut être converti en facture.");
        }

        if (factureRepository.existsByDevisId(devisId)) {
            throw new BadRequestException("Ce devis a déjà été converti en facture.");
        }

        Facture facture = Facture.builder()
                .numero(generateNumero())
                .devis(devis)
                .customer(devis.getCustomer())
                .chantierNom(devis.getChantierNom())
                .adresse(devis.getAdresse())
                .ville(devis.getVille())
                .codePostal(devis.getCodePostal())
                .statut(StatutFacture.BROUILLON)
                .montantTotalHt(zeroIfNull(devis.getMontantTotalHt()))
                .montantTva(zeroIfNull(devis.getMontantTva()))
                .montantTotalTtc(zeroIfNull(devis.getMontantTotalTtc()))
                .build();

        if (devis.getLines() != null) {
            for (DevisLine devisLine : devis.getLines()) {
                FactureLine factureLine = FactureLine.builder()
                        .facture(facture)
                        .designation(devisLine.getDesignation())
                        .quantite(devisLine.getQuantite())
                        .unite(devisLine.getUnite())
                        .totalLigneHt(devisLine.getTotalLigneHt())
                        .ordreAffichage(devisLine.getOrdreAffichage())
                        .build();

                facture.getLines().add(factureLine);
            }
        }

        devis.setStatut("CONVERTI");

        Facture saved = factureRepository.save(facture);
        return factureMapper.toResponse(saved);
    }

    private String generateNumero() {
        long next = factureRepository.count() + 1;
        String numero = String.format("FAC-2026-%03d", next);

        while (factureRepository.existsByNumero(numero)) {
            next++;
            numero = String.format("FAC-2026-%03d", next);
        }

        return numero;
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
