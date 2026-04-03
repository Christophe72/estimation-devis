package com.estimelec.estimation;

import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.customer.Customer;
import com.estimelec.customer.CustomerRepository;
import com.estimelec.estimation.dto.EstimationLineRequest;
import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;
import com.estimelec.estimation.mapper.EstimationMapper;
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
public class EstimationServiceImpl implements EstimationService {

    private final EstimationRepository estimationRepository;
    private final CustomerRepository customerRepository;
    private final EstimationMapper estimationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<EstimationResponse> findAll(Long customerId) {
        List<Estimation> estimations = customerId != null
                ? estimationRepository.findAllByCustomerIdOrderByIdDesc(customerId)
                : estimationRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Estimation::getId).reversed())
                .toList();

        return estimations.stream()
                .map(estimationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EstimationResponse findById(Long id) {
        Estimation estimation = estimationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable avec l'id : " + id));

        return estimationMapper.toResponse(estimation);
    }

    @Override
    public EstimationResponse create(EstimationRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer introuvable avec l'id : " + request.getCustomerId()));

        Estimation estimation = Estimation.builder()
                .designation(trimToNull(request.getDesignation()))
                .customer(customer)
                .description(trimToNull(request.getDescription()))
                .totalHt(BigDecimal.ZERO)
                .totalTva(BigDecimal.ZERO)
                .totalTtc(BigDecimal.ZERO)
                .build();

        applyLines(estimation, request);
        recalculateTotals(estimation);

        Estimation saved = estimationRepository.save(estimation);
        return estimationMapper.toResponse(saved);
    }

    @Override
    public EstimationResponse update(Long id, EstimationRequest request) {
        Estimation estimation = estimationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable avec l'id : " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer introuvable avec l'id : " + request.getCustomerId()));

        estimation.setDesignation(trimToNull(request.getDesignation()));
        estimation.setCustomer(customer);
        estimation.setDescription(trimToNull(request.getDescription()));

        estimation.clearLines();
        applyLines(estimation, request);
        recalculateTotals(estimation);

        Estimation saved = estimationRepository.save(estimation);
        return estimationMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Estimation estimation = estimationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimation introuvable avec l'id : " + id));

        estimationRepository.delete(estimation);
    }

    private void applyLines(Estimation estimation, EstimationRequest request) {
        if (request.getLines() == null || request.getLines().isEmpty()) {
            return;
        }

        int index = 0;

        for (EstimationLineRequest lineRequest : request.getLines()) {
            BigDecimal quantite = scale(lineRequest.getQuantite());
            BigDecimal prixUnitaireHt = scale(lineRequest.getPrixUnitaireHt());
            BigDecimal tauxTva = scale(lineRequest.getTauxTva());

            BigDecimal totalHt = scale(quantite.multiply(prixUnitaireHt));
            BigDecimal totalTva = scale(
                    totalHt.multiply(tauxTva).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
            );
            BigDecimal totalTtc = scale(totalHt.add(totalTva));

            EstimationLine line = EstimationLine.builder()
                    .typeLigne(lineRequest.getTypeLigne())
                    .designation(trimToNull(lineRequest.getDesignation()))
                    .quantite(quantite)
                    .unite(trimToNull(lineRequest.getUnite()))
                    .prixUnitaireHt(prixUnitaireHt)
                    .tauxTva(tauxTva)
                    .totalHt(totalHt)
                    .totalTva(totalTva)
                    .totalTtc(totalTtc)
                    .ordre(lineRequest.getOrdre() != null ? lineRequest.getOrdre() : index)
                    .build();

            estimation.addLine(line);
            index++;
        }
    }

    private void recalculateTotals(Estimation estimation) {
        BigDecimal totalHt = estimation.getLines().stream()
                .map(EstimationLine::getTotalHt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTva = estimation.getLines().stream()
                .map(EstimationLine::getTotalTva)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTtc = estimation.getLines().stream()
                .map(EstimationLine::getTotalTtc)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        estimation.setTotalHt(scale(totalHt));
        estimation.setTotalTva(scale(totalTva));
        estimation.setTotalTtc(scale(totalTtc));
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
