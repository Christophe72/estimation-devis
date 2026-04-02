package com.estimelec.ouvrage;

import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/ouvrages")
@RequiredArgsConstructor
public class OuvrageController {

    private final OuvrageService ouvrageService;

    @GetMapping
    public ResponseEntity<List<OuvrageResponse>> findAll() {
        return ResponseEntity.ok(ouvrageService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OuvrageResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ouvrageService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OuvrageResponse> create(@Valid @RequestBody OuvrageRequest request) {
        OuvrageResponse created = ouvrageService.create(request);

        return ResponseEntity
                .created(URI.create("/api/ouvrages/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OuvrageResponse> update(@PathVariable Long id, @Valid @RequestBody OuvrageRequest request) {
        return ResponseEntity.ok(ouvrageService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ouvrageService.delete(id);
    }
}
