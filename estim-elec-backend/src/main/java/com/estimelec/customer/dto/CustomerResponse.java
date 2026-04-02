package com.estimelec.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {

    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
