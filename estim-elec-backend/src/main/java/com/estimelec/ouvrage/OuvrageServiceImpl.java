package com.estimelec.ouvrage;

import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import com.estimelec.ouvrage.mapper.OuvrageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OuvrageServiceImpl implements OuvrageService {

    private final OuvrageRepository ouvrageRepository;
    private final OuvrageMapper ouvrageMapper;

    @Override
    @Transactional(readOnly = true)
    public List<OuvrageResponse> findAll(Boolean actifOnly) {
        List<Ouvrage> ouvrages = Boolean.TRUE.equals(actifOnly)
                ? ouvrageRepository.findAllByActifTrueOrderByDesignationAsc()
                : ouvrageRepository.findAllByOrderByDesignationAsc();

        return ouvrages.stream()
                .map(ouvrageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OuvrageResponse findById(Long id) {
        Ouvrage ouvrage = ouvrageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        return ouvrageMapper.toResponse(ouvrage);
    }

    @Override
    public OuvrageResponse create(OuvrageRequest request) {
        Ouvrage ouvrage = Ouvrage.builder()
                .code(trimToNull(request.getCode()))
                .designation(trimToNull(request.getDesignation()))
                .categorie(trimToNull(request.getCategorie()))
                .unite(trimToNull(request.getUnite()))
                .tempsPoseHeure(scale(request.getTempsPoseHeure()))
                .description(trimToNull(request.getDescription()))
                .actif(request.getActif() != null ? request.getActif() : Boolean.TRUE)
                .build();

        Ouvrage saved = ouvrageRepository.save(ouvrage);
        return ouvrageMapper.toResponse(saved);
    }

    @Override
    public OuvrageResponse update(Long id, OuvrageRequest request) {
        Ouvrage ouvrage = ouvrageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        ouvrage.setCode(trimToNull(request.getCode()));
        ouvrage.setDesignation(trimToNull(request.getDesignation()));
        ouvrage.setCategorie(trimToNull(request.getCategorie()));
        ouvrage.setUnite(trimToNull(request.getUnite()));
        ouvrage.setTempsPoseHeure(scale(request.getTempsPoseHeure()));
        ouvrage.setDescription(trimToNull(request.getDescription()));
        ouvrage.setActif(request.getActif() != null ? request.getActif() : Boolean.TRUE);

        Ouvrage saved = ouvrageRepository.save(ouvrage);
        return ouvrageMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Ouvrage ouvrage = ouvrageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        ouvrageRepository.delete(ouvrage);
    }

    private BigDecimal scale(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
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