package com.estimelec.ouvrage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ouvrages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ouvrage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 100)
    private String code;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;

    @Column(name = "categorie", nullable = false, length = 100)
    private String categorie;

    @Column(name = "unite", nullable = false, length = 30)
    private String unite;

    @Column(name = "temps_pose_heures", nullable = false, precision = 8, scale = 2)
    private BigDecimal tempsPoseHeure;

    @Column(name = "description")
    private String description;

    @Column(name = "actif", nullable = false)
    private Boolean actif;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
