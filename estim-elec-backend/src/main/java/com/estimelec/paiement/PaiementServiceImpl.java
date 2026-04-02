package com.estimelec.paiement;

import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.facture.Facture;
import com.estimelec.facture.FactureRepository;
import com.estimelec.facture.StatutFacture;
import com.estimelec.paiement.dto.PaiementRequest;
import com.estimelec.paiement.dto.PaiementResponse;
import com.estimelec.paiement.mapper.PaiementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;
    private final FactureRepository factureRepository;
    private final PaiementMapper paiementMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PaiementResponse> findAll(Long factureId) {
        List<Paiement> paiements;

        if (factureId != null) {
            paiements = paiementRepository.findByFactureId(factureId);
        } else {
            paiements = paiementRepository.findAll();
        }

        return paiements.stream()
                .map(this::toResponseWithTotals)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaiementResponse findById(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement introuvable avec l'id : " + id));

        return toResponseWithTotals(paiement);
    }

    @Override
    public PaiementResponse create(PaiementRequest request) {
        validateRequest(request);

        // 1. récupérer la facture
        Facture facture = factureRepository.findById(request.getFactureId())
                .orElseThrow(() -> new ResourceNotFoundException("Facture introuvable avec l'id : " + request.getFactureId()));

        if (facture.getStatut() == StatutFacture.ANNULEE) {
            throw new BadRequestException("Impossible d'ajouter un paiement sur une facture annulée.");
        }

        // 2. total déjà payé
        BigDecimal totalPaye = paiementRepository.sumMontantByFactureId(facture.getId());
        if (totalPaye == null) {
            totalPaye = BigDecimal.ZERO;
        }

        // 3. nouveau total
        BigDecimal nouveauTotal = totalPaye.add(request.getMontant());

        // 4. validation (anti dépassement)
        if (nouveauTotal.compareTo(facture.getMontantTotalTtc()) > 0) {
            throw new BadRequestException("Le paiement dépasse le montant restant à payer.");
        }

        // 5. création paiement
        Paiement paiement = paiementMapper.toEntity(request, facture);
        Paiement saved = paiementRepository.save(paiement);

        // 6. mise à jour statut facture
        updateStatutFacture(facture, nouveauTotal);

        return toResponseWithTotals(saved);
    }

    @Override
    public void delete(Long id) {
        if (!paiementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paiement introuvable avec id=" + id);
        }
        paiementRepository.deleteById(id);
    }

    private void validateRequest(PaiementRequest request) {
        if (request == null) {
            throw new BadRequestException("La requête est invalide.");
        }
        if (request.getFactureId() == null) {
            throw new BadRequestException("La factureId est obligatoire.");
        }
        if (request.getMontant() == null || request.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le montant doit être supérieur à 0.");
        }
        if (request.getDatePaiement() == null) {
            throw new BadRequestException("La date de paiement est obligatoire.");
        }
        if (request.getModePaiement() == null) {
            throw new BadRequestException("Le mode de paiement est obligatoire.");
        }
    }

    // logique métier ici
    private void updateStatutFacture(Facture facture, BigDecimal totalPaye) {
        BigDecimal totalFacture = facture.getMontantTotalTtc();
        if (totalPaye.compareTo(BigDecimal.ZERO) == 0) {
            facture.setStatut(StatutFacture.EMISE);
        } else if (totalPaye.compareTo(totalFacture) < 0) {
            facture.setStatut(StatutFacture.PARTIELLEMENT_PAYEE);
        } else {
            facture.setStatut(StatutFacture.PAYEE);
        }

        factureRepository.save(facture);
    }

    private PaiementResponse toResponseWithTotals(Paiement paiement) {
        Long factureId = paiement.getFacture() != null ? paiement.getFacture().getId() : null;
        BigDecimal totalPaye = factureId == null ? BigDecimal.ZERO : safe(paiementRepository.sumMontantByFactureId(factureId));
        BigDecimal totalFacture = paiement.getFacture() != null ? safe(paiement.getFacture().getMontantTotalTtc()) : BigDecimal.ZERO;
        BigDecimal reste = scale(totalFacture.subtract(totalPaye).max(BigDecimal.ZERO));

        return paiementMapper.toResponse(paiement, totalPaye, reste);
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : scale(value);
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
