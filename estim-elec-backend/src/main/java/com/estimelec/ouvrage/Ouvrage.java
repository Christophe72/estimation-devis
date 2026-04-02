package com.estimelec.ouvrage;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;

    @Column(name = "categorie", nullable = false, length = 100)
    private String categorie;

    @Column(name = "unite", nullable = false, length = 20)
    private String unite;

    @Column(name = "temps_pose_heures", nullable = false, precision = 8, scale = 2)
    private BigDecimal tempsPoseHeures;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "actif", nullable = false)
    private Boolean actif;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "ouvrage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OuvrageComponent> composants = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addComponent(OuvrageComponent component) {
        composants.add(component);
        component.setOuvrage(this);
    }

    public void clearComponents() {
        composants.forEach(component -> component.setOuvrage(null));
        composants.clear();
    }
}
