package com.estimelec.article;

import com.estimelec.article.dto.ArticleRequest;
import com.estimelec.article.dto.ArticleResponse;
import org.springframework.stereotype.Component;

@Component
public class ArticleMapper {

    public Article toEntity(ArticleRequest request) {
        if (request == null) {
            return null;
        }

        return Article.builder()
                .code(normalize(request.getCode()))
                .designation(normalize(request.getDesignation()))
                .categorie(normalize(request.getCategorie()))
                .unite(normalize(request.getUnite()))
                .prixAchatHt(request.getPrixAchatHt())
                .margeParDefaut(request.getMargeParDefaut())
                .actif(request.getActif())
                .build();
    }

    public ArticleResponse toResponse(Article article) {
        if (article == null) {
            return null;
        }

        return ArticleResponse.builder()
                .id(article.getId())
                .code(article.getCode())
                .designation(article.getDesignation())
                .categorie(article.getCategorie())
                .unite(article.getUnite())
                .prixAchatHt(article.getPrixAchatHt())
                .margeParDefaut(article.getMargeParDefaut())
                .actif(article.getActif())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    public void updateEntity(Article article, ArticleRequest request) {
        article.setCode(normalize(request.getCode()));
        article.setDesignation(normalize(request.getDesignation()));
        article.setCategorie(normalize(request.getCategorie()));
        article.setUnite(normalize(request.getUnite()));
        article.setPrixAchatHt(request.getPrixAchatHt());
        article.setMargeParDefaut(request.getMargeParDefaut());
        article.setActif(request.getActif());
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}
