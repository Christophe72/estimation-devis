package com.estimelec.article;

import com.estimelec.article.dto.ArticleRequest;
import com.estimelec.article.dto.ArticleResponse;

import java.util.List;

public interface ArticleService {

    List<ArticleResponse> findAll();

    ArticleResponse findById(Long id);

    ArticleResponse create(ArticleRequest request);

    ArticleResponse update(Long id, ArticleRequest request);

    void delete(Long id);
}
