package com.estimelec.estimation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class EstimationRequest {

    @NotBlank(message = "La désignation est obligatoire.")
    @Size(max = 255, message = "La désignation ne peut pas dépasser 255 caractères.")
    private String designation;

    @NotNull(message = "Le customerId est obligatoire.")
    private Long customerId;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères.")
    private String description;

    @Valid
    @NotNull(message = "Les lignes sont obligatoires.")
    @Size(min = 1, message = "L'estimation doit contenir au moins une ligne.")
    private List<EstimationLineRequest> lines = new ArrayList<>();

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<EstimationLineRequest> getLines() {
        return lines;
    }

    public void setLines(List<EstimationLineRequest> lines) {
        this.lines = lines;
    }
}