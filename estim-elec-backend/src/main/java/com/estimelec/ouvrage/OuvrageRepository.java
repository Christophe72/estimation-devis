package com.estimelec.ouvrage;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OuvrageRepository extends JpaRepository<Ouvrage, Long> {

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    @Override
    @EntityGraph(attributePaths = {"composants", "composants.article"})
    List<Ouvrage> findAll();

    @EntityGraph(attributePaths = {"composants", "composants.article"})
    Optional<Ouvrage> findWithComposantsById(Long id);
}
