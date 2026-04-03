package com.estimelec.ouvrage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OuvrageRepository extends JpaRepository<Ouvrage, Long> {

    List<Ouvrage> findAllByOrderByDesignationAsc();

    List<Ouvrage> findAllByActifTrueOrderByDesignationAsc();
}