package com.estimelec.ouvrage;

import com.estimelec.article.Article;
import com.estimelec.ouvrage.dto.OuvrageComponentRequest;
import com.estimelec.ouvrage.dto.OuvrageComponentResponse;
import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class OuvrageMapper {

    public Ouvrage toEntity(OuvrageRequest request) {
        if (request == null) {
            return null;
        }

        return Ouvrage.builder()
                .code(normalize(request.getCode()))
                .designation(normalize(request.getDesignation()))
                .categorie(normalize(request.getCategorie()))
                .unite(normalize(request.getUnite()))
                .tempsPoseHeures(request.getTempsPoseHeures())
                .description(normalizeNullable(request.getDescription()))
                .actif(request.getActif())
                .build();
    }

    public void updateEntity(Ouvrage ouvrage, OuvrageRequest request) {
        ouvrage.setCode(normalize(request.getCode()));
        ouvrage.setDesignation(normalize(request.getDesignation()));
        ouvrage.setCategorie(normalize(request.getCategorie()));
        ouvrage.setUnite(normalize(request.getUnite()));
        ouvrage.setTempsPoseHeures(request.getTempsPoseHeures());
        ouvrage.setDescription(normalizeNullable(request.getDescription()));
        ouvrage.setActif(request.getActif());
    }

    public OuvrageComponent toComponentEntity(OuvrageComponentRequest request, Article article) {
        return OuvrageComponent.builder()
                .article(article)
                .quantite(request.getQuantite())
                .build();
    }

    public OuvrageResponse toResponse(Ouvrage ouvrage) {
        if (ouvrage == null) {
            return null;
        }

        List<OuvrageComponentResponse> composants = ouvrage.getComposants()
                .stream()
                .map(this::toComponentResponse)
                .toList();

        BigDecimal coutMaterielHt = composants.stream()
                .map(OuvrageComponentResponse::getCoutTotalHt)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OuvrageResponse.builder()
                .id(ouvrage.getId())
                .code(ouvrage.getCode())
                .designation(ouvrage.getDesignation())
                .categorie(ouvrage.getCategorie())
                .unite(ouvrage.getUnite())
                .tempsPoseHeures(ouvrage.getTempsPoseHeures())
                .description(ouvrage.getDescription())
                .actif(ouvrage.getActif())
                .coutMaterielHt(coutMaterielHt)
                .createdAt(ouvrage.getCreatedAt())
                .updatedAt(ouvrage.getUpdatedAt())
                .composants(composants)
                .build();
    }

    private OuvrageComponentResponse toComponentResponse(OuvrageComponent component) {
        BigDecimal prixAchatHt = component.getArticle().getPrixAchatHt();
        BigDecimal coutTotalHt = prixAchatHt.multiply(component.getQuantite());

        return OuvrageComponentResponse.builder()
                .id(component.getId())
                .articleId(component.getArticle().getId())
                .articleCode(component.getArticle().getCode())
                .articleDesignation(component.getArticle().getDesignation())
                .articleCategorie(component.getArticle().getCategorie())
                .unite(component.getArticle().getUnite())
                .quantite(component.getQuantite())
                .prixAchatHt(prixAchatHt)
                .coutTotalHt(coutTotalHt)
                .build();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
