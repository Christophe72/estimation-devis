package com.estimelec.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRequest {

    @NotBlank(message = "Le nom est obligatoire.")
    @Size(max = 150, message = "Le nom ne peut pas dépasser 150 caractères.")
    private String nom;

    @Email(message = "L'email doit être valide.")
    @Size(max = 150, message = "L'email ne peut pas dépasser 150 caractères.")
    private String email;

    @Size(max = 50, message = "Le téléphone ne peut pas dépasser 50 caractères.")
    private String telephone;

    @Size(max = 255, message = "L'adresse ne peut pas dépasser 255 caractères.")
    private String adresse;

    @Size(max = 120, message = "La ville ne peut pas dépasser 120 caractères.")
    private String ville;

    @Size(max = 20, message = "Le code postal ne peut pas dépasser 20 caractères.")
    private String codePostal;
}
