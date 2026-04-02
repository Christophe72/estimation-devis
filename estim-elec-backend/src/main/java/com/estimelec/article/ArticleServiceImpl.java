package com.estimelec.article;

import com.estimelec.article.dto.ArticleRequest;
import com.estimelec.article.dto.ArticleResponse;
import com.estimelec.common.exception.BadRequestException;
import com.estimelec.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;

    @Override
    public List<ArticleResponse> findAll() {
        return articleRepository.findAll()
                .stream()
                .map(articleMapper::toResponse)
                .toList();
    }

    @Override
    public ArticleResponse findById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article introuvable avec l'id : " + id));

        return articleMapper.toResponse(article);
    }

    @Override
    public ArticleResponse create(ArticleRequest request) {
        validateCodeUniquenessForCreate(request.getCode());

        Article article = articleMapper.toEntity(request);
        Article savedArticle = articleRepository.save(article);

        return articleMapper.toResponse(savedArticle);
    }

    @Override
    public ArticleResponse update(Long id, ArticleRequest request) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article introuvable avec l'id : " + id));

        validateCodeUniquenessForUpdate(request.getCode(), id);

        articleMapper.updateEntity(existingArticle, request);
        Article updatedArticle = articleRepository.save(existingArticle);

        return articleMapper.toResponse(updatedArticle);
    }

    @Override
    public void delete(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article introuvable avec l'id : " + id));

        articleRepository.delete(article);
    }

    private void validateCodeUniquenessForCreate(String code) {
        if (articleRepository.existsByCodeIgnoreCase(code.trim())) {
            throw new BadRequestException("Un article existe déjà avec le code : " + code);
        }
    }

    private void validateCodeUniquenessForUpdate(String code, Long id) {
        if (articleRepository.existsByCodeIgnoreCaseAndIdNot(code.trim(), id)) {
            throw new BadRequestException("Un autre article existe déjà avec le code : " + code);
        }
    }
}
