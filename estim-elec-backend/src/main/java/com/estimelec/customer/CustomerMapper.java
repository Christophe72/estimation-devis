package com.estimelec.customer;

import com.estimelec.customer.dto.CustomerRequest;
import com.estimelec.customer.dto.CustomerResponse;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequest request) {
        if (request == null) {
            return null;
        }

        return Customer.builder()
                .nom(normalize(request.getNom()))
                .email(normalizeNullable(request.getEmail()))
                .telephone(normalizeNullable(request.getTelephone()))
                .adresse(normalizeNullable(request.getAdresse()))
                .ville(normalizeNullable(request.getVille()))
                .codePostal(normalizeNullable(request.getCodePostal()))
                .build();
    }

    public CustomerResponse toResponse(Customer customer) {
        if (customer == null) {
            return null;
        }

        return CustomerResponse.builder()
                .id(customer.getId())
                .nom(customer.getNom())
                .email(customer.getEmail())
                .telephone(customer.getTelephone())
                .adresse(customer.getAdresse())
                .ville(customer.getVille())
                .codePostal(customer.getCodePostal())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    public void updateEntity(Customer customer, CustomerRequest request) {
        customer.setNom(normalize(request.getNom()));
        customer.setEmail(normalizeNullable(request.getEmail()));
        customer.setTelephone(normalizeNullable(request.getTelephone()));
        customer.setAdresse(normalizeNullable(request.getAdresse()));
        customer.setVille(normalizeNullable(request.getVille()));
        customer.setCodePostal(normalizeNullable(request.getCodePostal()));
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
