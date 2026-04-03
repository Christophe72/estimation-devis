package com.estimelec.estimation;

import com.estimelec.estimation.dto.EstimationRequest;
import com.estimelec.estimation.dto.EstimationResponse;
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
@RequestMapping("/api/estimations")
@RequiredArgsConstructor
public class EstimationController {

    private final EstimationService estimationService;

    @GetMapping
    public ResponseEntity<List<EstimationResponse>> findAll(
            @RequestParam(required = false) Long customerId
    ) {
        return ResponseEntity.ok(estimationService.findAll(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstimationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(estimationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<EstimationResponse> create(@Valid @RequestBody EstimationRequest request) {
        EstimationResponse created = estimationService.create(request);
        return ResponseEntity
                .created(URI.create("/api/estimations/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstimationResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody EstimationRequest request
    ) {
        return ResponseEntity.ok(estimationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        estimationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
