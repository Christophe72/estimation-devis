package com.estimelec.estimation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimationRequest {

    @NotBlank(message = "La designation est obligatoire.")
    private String designation;

    @NotNull(message = "Le customerId est obligatoire.")
    private Long customerId;

    private String description;

    @Valid
    @NotEmpty(message = "L'estimation doit contenir au moins une ligne.")
    private List<EstimationLineRequest> lines;
}