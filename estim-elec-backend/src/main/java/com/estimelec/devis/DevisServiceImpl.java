package com.estimelec.devis;

import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.customer.Customer;
import com.estimelec.customer.CustomerRepository;
import com.estimelec.devis.dto.DevisLineRequest;
import com.estimelec.devis.dto.DevisRequest;
import com.estimelec.devis.dto.DevisResponse;
import com.estimelec.devis.mapper.DevisMapper;
import com.estimelec.ouvrage.Ouvrage;
import com.estimelec.ouvrage.OuvrageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DevisServiceImpl implements DevisService {

    private final DevisRepository devisRepository;
    private final CustomerRepository customerRepository;
    private final OuvrageRepository ouvrageRepository;
    private final DevisMapper devisMapper;

    @Override
    @Transactional(readOnly = true)
    public List<DevisResponse> findAll(Long customerId, String statut) {
        List<Devis> devisList;

        if (customerId != null && statut != null && !statut.isBlank()) {
            devisList = devisRepository.findByCustomerIdAndStatut(customerId, statut.trim());
        } else if (customerId != null) {
            devisList = devisRepository.findByCustomerId(customerId);
        } else if (statut != null && !statut.isBlank()) {
            devisList = devisRepository.findByStatut(statut.trim());
        } else {
            devisList = devisRepository.findAll();
        }

        return devisList.stream()
                .sorted(Comparator.comparing(Devis::getId).reversed())
                .map(devisMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DevisResponse findById(Long id) {
        Devis devis = findEntityById(id);
        return devisMapper.toResponse(devis);
    }

    @Override
    public DevisResponse create(DevisRequest request) {
        validateRequest(request);

        Customer customer = findCustomerById(request.getCustomerId());
        String numero = request.getNumero().trim();
        if (devisRepository.existsByNumero(numero)) {
            throw new BadRequestException("Un devis avec ce numéro existe déjà.");
        }

        Devis devis = devisMapper.toEntity(request, customer);
        replaceLines(devis, request.getLines());
        recalculateTotals(devis);

        Devis saved = devisRepository.save(devis);
        return devisMapper.toResponse(saved);
    }

    @Override
    public DevisResponse update(Long id, DevisRequest request) {
        validateRequest(request);

        Devis existing = findEntityById(id);
        Customer customer = findCustomerById(request.getCustomerId());

        String numero = request.getNumero().trim();
        devisRepository.findByNumero(numero)
                .filter(found -> !found.getId().equals(id))
                .ifPresent(found -> {
                    throw new BadRequestException("Un devis avec ce numéro existe déjà.");
                });

        devisMapper.updateEntity(existing, request, customer);
        existing.getLines().clear();
        replaceLines(existing, request.getLines());
        recalculateTotals(existing);

        Devis updated = devisRepository.save(existing);
        return devisMapper.toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        Devis existing = findEntityById(id);
        devisRepository.delete(existing);
    }

    private Devis findEntityById(Long id) {
        return devisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis introuvable avec l'id : " + id));
    }

    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + customerId));
    }

    private void validateRequest(DevisRequest request) {
        if (request == null) {
            throw new BadRequestException("La requête est invalide.");
        }
        if (request.getCustomerId() == null) {
            throw new BadRequestException("Le customerId est obligatoire.");
        }
        if (request.getNumero() == null || request.getNumero().trim().isEmpty()) {
            throw new BadRequestException("Le numéro du devis est obligatoire.");
        }
        if (request.getChantierNom() == null || request.getChantierNom().trim().isEmpty()) {
            throw new BadRequestException("Le nom du chantier est obligatoire.");
        }
        if (request.getTypeChantier() == null || request.getTypeChantier().trim().isEmpty()) {
            throw new BadRequestException("Le type de chantier est obligatoire.");
        }
        if (request.getStatut() == null || request.getStatut().trim().isEmpty()) {
            throw new BadRequestException("Le statut est obligatoire.");
        }
        if (request.getTauxHoraire() == null || request.getTauxHoraire().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le taux horaire doit être supérieur à 0.");
        }
        if (request.getCoefficientChantier() != null && request.getCoefficientChantier().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le coefficient chantier doit être supérieur à 0.");
        }
        if (request.getLines() != null) {
            for (DevisLineRequest line : request.getLines()) {
                validateLine(line);
            }
        }
    }

    private void validateLine(DevisLineRequest line) {
        if (line == null) {
            throw new BadRequestException("Une ligne du devis est invalide.");
        }
        if (line.getTypeLigne() == null || line.getTypeLigne().trim().isEmpty()) {
            throw new BadRequestException("Le type de ligne est obligatoire.");
        }
        if (line.getDesignation() == null || line.getDesignation().trim().isEmpty()) {
            throw new BadRequestException("La désignation de la ligne est obligatoire.");
        }
        if (line.getQuantite() == null || line.getQuantite().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("La quantité d'une ligne doit être supérieure à 0.");
        }
        if (line.getUnite() == null || line.getUnite().trim().isEmpty()) {
            throw new BadRequestException("L'unité d'une ligne est obligatoire.");
        }
        if (line.getTempsUnitaireHeures() != null && line.getTempsUnitaireHeures().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Le temps unitaire d'une ligne doit être supérieur ou égal à 0.");
        }
        if (line.getCoutMaterielUnitaireHt() != null && line.getCoutMaterielUnitaireHt().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Le coût matériel unitaire d'une ligne doit être supérieur ou égal à 0.");
        }
        if (line.getCoutMainOeuvreUnitaireHt() != null && line.getCoutMainOeuvreUnitaireHt().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Le coût main d'oeuvre unitaire d'une ligne doit être supérieur ou égal à 0.");
        }
    }

    private void replaceLines(Devis devis, List<DevisLineRequest> lineRequests) {
        if (lineRequests == null || lineRequests.isEmpty()) {
            return;
        }

        for (DevisLineRequest request : lineRequests) {
            Ouvrage ouvrage = null;
            if (request.getOuvrageId() != null) {
                ouvrage = ouvrageRepository.findById(request.getOuvrageId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + request.getOuvrageId()));
            }

            DevisLine line = devisMapper.toLineEntity(request, devis, ouvrage);
            devis.getLines().add(line);
        }
    }

    private void recalculateTotals(Devis devis) {
        BigDecimal montantMaterielHt = sumMateriel(devis);
        BigDecimal montantMainOeuvreHt = sumMainOeuvre(devis, devis.getTauxHoraire(), devis.getCoefficientChantier());
        BigDecimal baseHt = montantMaterielHt.add(montantMainOeuvreHt);

        BigDecimal montantFraisGenerauxHt = percentage(baseHt, devis.getTauxFraisGeneraux());
        BigDecimal montantMargeHt = percentage(baseHt.add(montantFraisGenerauxHt), devis.getTauxMarge());
        BigDecimal montantTotalHt = baseHt.add(montantFraisGenerauxHt).add(montantMargeHt);
        BigDecimal montantTva = percentage(montantTotalHt, devis.getTauxTva());
        BigDecimal montantTotalTtc = montantTotalHt.add(montantTva);

        devis.setMontantMaterielHt(scale(montantMaterielHt));
        devis.setMontantMainOeuvreHt(scale(montantMainOeuvreHt));
        devis.setMontantFraisGenerauxHt(scale(montantFraisGenerauxHt));
        devis.setMontantMargeHt(scale(montantMargeHt));
        devis.setMontantTotalHt(scale(montantTotalHt));
        devis.setMontantTva(scale(montantTva));
        devis.setMontantTotalTtc(scale(montantTotalTtc));
    }

    private BigDecimal sumMateriel(Devis devis) {
        return devis.getLines().stream()
                .map(line -> scale(line.getQuantite().multiply(line.getCoutMaterielUnitaireHt())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumMainOeuvre(Devis devis, BigDecimal tauxHoraire, BigDecimal coefficientChantier) {
        return devis.getLines().stream()
                .map(line -> {
                    BigDecimal heures = line.getTempsUnitaireHeures().multiply(line.getQuantite());
                    BigDecimal base = heures.multiply(tauxHoraire).multiply(coefficientChantier);
                    return scale(base);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal percentage(BigDecimal base, BigDecimal taux) {
        return scale(base.multiply(taux).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
    }

    private BigDecimal scale(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
