package com.estimelec.estimation;

import com.estimelec.devis.dto.DevisResponse;
import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/estimations")
@RequiredArgsConstructor
public class EstimationController {

    private final EstimationService estimationService;

    @PostMapping
    public ResponseEntity<EstimationResponse> create(@Valid @RequestBody EstimationRequest request) {
        EstimationResponse response = estimationService.create(request);

        return ResponseEntity
                .created(URI.create("/api/estimations/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<EstimationResponse>> findAll() {
        return ResponseEntity.ok(estimationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstimationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(estimationService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstimationResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody EstimationRequest request) {
        return ResponseEntity.ok(estimationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        estimationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/convertir-en-devis")
    public ResponseEntity<DevisResponse> convertirEnDevis(@PathVariable Long id) {
        return ResponseEntity.ok(estimationService.convertirEnDevis(id));
    }
}
