package com.estimelec.estimation.mapper;

import com.estimelec.estimation.Estimation;
import com.estimelec.estimation.EstimationLine;
import com.estimelec.estimation.dto.EstimationLineResponse;
import com.estimelec.estimation.dto.EstimationResponse;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class EstimationMapper {

    public EstimationResponse toResponse(Estimation estimation) {
        List<EstimationLineResponse> lines = estimation.getLines() == null
                ? List.of()
                : estimation.getLines()
                .stream()
                .sorted(
                        Comparator.comparing(
                                EstimationLine::getOrdre,
                                Comparator.nullsLast(Integer::compareTo)
                        ).thenComparing(EstimationLine::getId)
                )
                .map(this::toLineResponse)
                .toList();

        return EstimationResponse.builder()
                .id(estimation.getId())
                .designation(estimation.getDesignation())
                .customerId(estimation.getCustomer().getId())
                .customerNom(estimation.getCustomer().getNom())
                .description(estimation.getDescription())
                .totalHt(estimation.getTotalHt())
                .totalTva(estimation.getTotalTva())
                .totalTtc(estimation.getTotalTtc())
                .createdAt(estimation.getCreatedAt())
                .updatedAt(estimation.getUpdatedAt())
                .lines(lines)
                .build();
    }

    public EstimationLineResponse toLineResponse(EstimationLine line) {
        return EstimationLineResponse.builder()
                .id(line.getId())
                .ouvrageId(line.getOuvrage() != null ? line.getOuvrage().getId() : null)
                .ouvrageCode(line.getOuvrage() != null ? line.getOuvrage().getCode() : null)
                .ouvrageDesignation(line.getOuvrage() != null ? line.getOuvrage().getDesignation() : null)
                .quantite(line.getQuantite())
                .prixUnitaireHt(line.getPrixUnitaireHt())
                .totalHt(line.getTotalHt())
                .ordre(line.getOrdre())
                .createdAt(line.getCreatedAt())
                .updatedAt(line.getUpdatedAt())
                .build();
    }
}
