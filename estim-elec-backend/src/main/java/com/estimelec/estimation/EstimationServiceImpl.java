package com.estimelec.estimation;

import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.customer.Customer;
import com.estimelec.customer.CustomerRepository;
import com.estimelec.devis.Devis;
import com.estimelec.devis.DevisLine;
import com.estimelec.devis.DevisRepository;
import com.estimelec.devis.StatutDevis;
import com.estimelec.devis.dto.DevisResponse;
import com.estimelec.devis.mapper.DevisMapper;
import com.estimelec.estimation.dto.EstimationLineRequest;
import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;
import com.estimelec.estimation.mapper.EstimationMapper;
import com.estimelec.ouvrage.Ouvrage;
import com.estimelec.ouvrage.OuvrageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EstimationServiceImpl implements EstimationService {

    private final EstimationRepository estimationRepository;
    private final CustomerRepository customerRepository;
    private final OuvrageRepository ouvrageRepository;
    private final EstimationMapper estimationMapper;
    private final DevisRepository devisRepository;
    private final DevisMapper devisMapper;

    @Override
    public EstimationResponse create(EstimationRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer introuvable"));

        Estimation estimation = Estimation.builder()
                .designation(request.getDesignation())
                .description(request.getDescription())
                .customer(customer)
                .lines(new ArrayList<>())
                .build();

        if (request.getLines() != null) {
            int ordre = 1;

            for (EstimationLineRequest lineRequest : request.getLines()) {
                Ouvrage ouvrage = ouvrageRepository.findById(lineRequest.getOuvrageId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable"));

                EstimationLine line = buildLine(estimation, lineRequest, ouvrage, ordre++);
                estimation.getLines().add(line);
            }
        }

        recalculerTotaux(estimation);

        Estimation saved = estimationRepository.save(estimation);
        return estimationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EstimationResponse> findAll() {
        return estimationRepository.findAll()
                .stream()
                .map(estimationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EstimationResponse findById(Long id) {
        Estimation estimation = estimationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable"));

        return estimationMapper.toResponse(estimation);
    }

    @Override
    public EstimationResponse update(Long id, EstimationRequest request) {
        Estimation estimation = estimationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer introuvable"));

        estimation.setDesignation(request.getDesignation());
        estimation.setDescription(request.getDescription());
        estimation.setCustomer(customer);

        estimation.getLines().clear();

        if (request.getLines() != null) {
            int ordre = 1;

            for (EstimationLineRequest lineRequest : request.getLines()) {
                Ouvrage ouvrage = ouvrageRepository.findById(lineRequest.getOuvrageId())
                        .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable"));

                EstimationLine line = buildLine(estimation, lineRequest, ouvrage, ordre++);
                estimation.getLines().add(line);
            }
        }

        recalculerTotaux(estimation);

        return estimationMapper.toResponse(estimation);
    }

    @Override
    public void delete(Long id) {
        if (!estimationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Estimation introuvable");
        }
        estimationRepository.deleteById(id);
    }

    @Override
    public DevisResponse convertirEnDevis(Long estimationId) {
        Estimation estimation = estimationRepository.findById(estimationId)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable"));

        if (estimation.getLines() == null || estimation.getLines().isEmpty()) {
            throw new BadRequestException("Impossible de convertir une estimation sans lignes.");
        }

        Devis devis = Devis.builder()
                .numero(genererNumeroDevis())
                .customer(estimation.getCustomer())
                .chantierNom(estimation.getDesignation())
                .adresse(null)
                .ville(null)
                .codePostal(null)
                .typeChantier("ESTIMATION")
                .statut(StatutDevis.BROUILLON.name())
                .tauxHoraire(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .coefficientChantier(new BigDecimal("1.00"))
                .tauxFraisGeneraux(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .tauxMarge(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .tauxTva(new BigDecimal("21.00"))
                .montantMaterielHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantMainOeuvreHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantFraisGenerauxHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantMargeHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantTotalHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantTva(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .montantTotalTtc(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .lines(new ArrayList<>())
                .build();

        int ordre = 1;
        BigDecimal totalMaterielHt = BigDecimal.ZERO;
        BigDecimal totalMainOeuvreHt = BigDecimal.ZERO;

        for (EstimationLine estimationLine : estimation.getLines()) {
            BigDecimal quantite = estimationLine.getQuantite() != null
                    ? estimationLine.getQuantite()
                    : BigDecimal.ZERO;

            BigDecimal prixUnitaireHt = estimationLine.getPrixUnitaireHt() != null
                    ? estimationLine.getPrixUnitaireHt()
                    : BigDecimal.ZERO;

            BigDecimal totalLigneHt = estimationLine.getTotalHt() != null
                    ? estimationLine.getTotalHt()
                    : prixUnitaireHt.multiply(quantite);

            totalLigneHt = totalLigneHt.setScale(2, RoundingMode.HALF_UP);

            DevisLine devisLine = DevisLine.builder()
                    .devis(devis)
                    .typeLigne("MATERIEL")
                    .ouvrage(estimationLine.getOuvrage())
                    .designation(
                            estimationLine.getOuvrage() != null
                                    ? estimationLine.getOuvrage().getDesignation()
                                    : "Ligne estimation"
                    )
                    .quantite(quantite)
                    .unite("U")
                    .tempsUnitaireHeures(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .coutMaterielUnitaireHt(prixUnitaireHt)
                    .coutMainOeuvreUnitaireHt(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .totalLigneHt(totalLigneHt)
                    .ordreAffichage(ordre++)
                    .build();

            devis.getLines().add(devisLine);
            totalMaterielHt = totalMaterielHt.add(totalLigneHt);
        }

        totalMaterielHt = totalMaterielHt.setScale(2, RoundingMode.HALF_UP);
        totalMainOeuvreHt = totalMainOeuvreHt.setScale(2, RoundingMode.HALF_UP);

        BigDecimal montantFraisGenerauxHt = totalMaterielHt
                .multiply(devis.getTauxFraisGeneraux())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal baseAvantMarge = totalMaterielHt
                .add(totalMainOeuvreHt)
                .add(montantFraisGenerauxHt);

        BigDecimal montantMargeHt = baseAvantMarge
                .multiply(devis.getTauxMarge())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal montantTotalHt = baseAvantMarge
                .add(montantMargeHt)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal montantTva = montantTotalHt
                .multiply(devis.getTauxTva())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal montantTotalTtc = montantTotalHt
                .add(montantTva)
                .setScale(2, RoundingMode.HALF_UP);

        devis.setMontantMaterielHt(totalMaterielHt);
        devis.setMontantMainOeuvreHt(totalMainOeuvreHt);
        devis.setMontantFraisGenerauxHt(montantFraisGenerauxHt);
        devis.setMontantMargeHt(montantMargeHt);
        devis.setMontantTotalHt(montantTotalHt);
        devis.setMontantTva(montantTva);
        devis.setMontantTotalTtc(montantTotalTtc);

        Devis savedDevis = devisRepository.save(devis);
        return devisMapper.toResponse(savedDevis);
    }

    private EstimationLine buildLine(Estimation estimation,
                                     EstimationLineRequest request,
                                     Ouvrage ouvrage,
                                     int ordre) {

        BigDecimal quantite = request.getQuantite();
        BigDecimal prix = request.getPrixUnitaireHt();

        if (quantite == null || prix == null) {
            throw new BadRequestException("Quantité et prix obligatoires");
        }

        BigDecimal total = prix.multiply(quantite).setScale(2, RoundingMode.HALF_UP);

        return EstimationLine.builder()
                .estimation(estimation)
                .ouvrage(ouvrage)
                .quantite(quantite)
                .prixUnitaireHt(prix)
                .totalHt(total)
                .ordre(ordre)
                .build();
    }

    private void recalculerTotaux(Estimation estimation) {
        BigDecimal totalHt = estimation.getLines()
                .stream()
                .map(EstimationLine::getTotalHt)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal tva = totalHt
                .multiply(new BigDecimal("0.21"))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal ttc = totalHt
                .add(tva)
                .setScale(2, RoundingMode.HALF_UP);

        estimation.setTotalHt(totalHt);
        estimation.setTotalTva(tva);
        estimation.setTotalTtc(ttc);
    }

    private String genererNumeroDevis() {
        int annee = Year.now().getValue();
        int sequence = 1;

        String numero;
        do {
            numero = String.format("DEV-%d-%04d", annee, sequence++);
        } while (devisRepository.existsByNumero(numero));

        return numero;
    }
}
