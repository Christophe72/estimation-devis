package com.estimelec.ouvrage;

import com.estimelec.article.Article;
import com.estimelec.article.ArticleRepository;
import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import com.estimelec.ouvrage.dto.OuvrageComponentRequest;
import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class OuvrageServiceImpl implements OuvrageService {

    private final OuvrageRepository ouvrageRepository;
    private final OuvrageComponentRepository ouvrageComponentRepository;
    private final ArticleRepository articleRepository;
    private final OuvrageMapper ouvrageMapper;

    @Override
    @Transactional(readOnly = true)
    public List<OuvrageResponse> findAll() {
        return ouvrageRepository.findAll()
                .stream()
                .map(ouvrageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OuvrageResponse findById(Long id) {
        Ouvrage ouvrage = ouvrageRepository.findWithComposantsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        return ouvrageMapper.toResponse(ouvrage);
    }

    @Override
    public OuvrageResponse create(OuvrageRequest request) {
        validateCodeUniquenessForCreate(request.getCode());
        validateDuplicateArticles(request.getComposants());

        Ouvrage ouvrage = ouvrageMapper.toEntity(request);
        attachComponents(ouvrage, request.getComposants());

        Ouvrage saved = ouvrageRepository.save(ouvrage);
        Ouvrage reloaded = ouvrageRepository.findWithComposantsById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + saved.getId()));

        return ouvrageMapper.toResponse(reloaded);
    }

    @Override
    public OuvrageResponse update(Long id, OuvrageRequest request) {
        Ouvrage existing = ouvrageRepository.findWithComposantsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        validateCodeUniquenessForUpdate(request.getCode(), id);
        validateDuplicateArticles(request.getComposants());

        ouvrageMapper.updateEntity(existing, request);
        existing.clearComponents();
        attachComponents(existing, request.getComposants());

        Ouvrage updated = ouvrageRepository.save(existing);
        Ouvrage reloaded = ouvrageRepository.findWithComposantsById(updated.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + updated.getId()));

        return ouvrageMapper.toResponse(reloaded);
    }

    @Override
    public void delete(Long id) {
        Ouvrage ouvrage = ouvrageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ouvrage introuvable avec l'id : " + id));

        ouvrageRepository.delete(ouvrage);
    }

    private void attachComponents(Ouvrage ouvrage, List<OuvrageComponentRequest> composants) {
        for (OuvrageComponentRequest componentRequest : composants) {
            Article article = articleRepository.findById(componentRequest.getArticleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Article introuvable avec l'id : " + componentRequest.getArticleId()
                    ));

            OuvrageComponent component = ouvrageMapper.toComponentEntity(componentRequest, article);
            ouvrage.addComponent(component);
        }
    }

    private void validateCodeUniquenessForCreate(String code) {
        if (ouvrageRepository.existsByCodeIgnoreCase(code.trim())) {
            throw new BadRequestException("Un ouvrage existe déjà avec le code : " + code);
        }
    }

    private void validateCodeUniquenessForUpdate(String code, Long id) {
        if (ouvrageRepository.existsByCodeIgnoreCaseAndIdNot(code.trim(), id)) {
            throw new BadRequestException("Un autre ouvrage existe déjà avec le code : " + code);
        }
    }

    private void validateDuplicateArticles(List<OuvrageComponentRequest> composants) {
        Set<Long> articleIds = new HashSet<>();

        for (OuvrageComponentRequest component : composants) {
            if (!articleIds.add(component.getArticleId())) {
                throw new BadRequestException(
                        "Le même article ne peut pas être présent plusieurs fois dans un ouvrage : " + component.getArticleId()
                );
            }
        }
    }
}
