package com.estimelec.estimation;

import com.estimelec.customer.Customer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "estimations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estimation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "total_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalHt;

    @Column(name = "total_tva", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalTva;

    @Column(name = "total_ttc", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalTtc;

    @OneToMany(mappedBy = "estimation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EstimationLine> lines = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.totalHt == null) {
            this.totalHt = BigDecimal.ZERO;
        }
        if (this.totalTva == null) {
            this.totalTva = BigDecimal.ZERO;
        }
        if (this.totalTtc == null) {
            this.totalTtc = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addLine(EstimationLine line) {
        this.lines.add(line);
        line.setEstimation(this);
    }

    public void clearLines() {
        for (EstimationLine line : this.lines) {
            line.setEstimation(null);
        }
        this.lines.clear();
    }
}
