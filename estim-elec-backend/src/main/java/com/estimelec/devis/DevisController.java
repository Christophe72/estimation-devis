package com.estimelec.devis;

import com.estimelec.devis.dto.DevisRequest;
import com.estimelec.devis.dto.DevisResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/devis")
@RequiredArgsConstructor
public class DevisController {

    private final DevisService devisService;

    @GetMapping
    public ResponseEntity<List<DevisResponse>> findAll(@RequestParam(required = false) Long customerId,
                                                       @RequestParam(required = false) String statut) {
        return ResponseEntity.ok(devisService.findAll(customerId, statut));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DevisResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(devisService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DevisResponse> create(@Valid @RequestBody DevisRequest request) {
        DevisResponse created = devisService.create(request);
        return ResponseEntity.created(URI.create("/api/devis/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DevisResponse> update(@PathVariable Long id, @Valid @RequestBody DevisRequest request) {
        return ResponseEntity.ok(devisService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        devisService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
