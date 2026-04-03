package com.estimelec.ouvrage;

import com.estimelec.ouvrage.dto.OuvrageRequest;
import com.estimelec.ouvrage.dto.OuvrageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/ouvrages")
@RequiredArgsConstructor
public class OuvrageController {

    private final OuvrageService ouvrageService;

    @GetMapping
    public ResponseEntity<List<OuvrageResponse>> findAll(
            @RequestParam(required = false) Boolean actifOnly
    ) {
        return ResponseEntity.ok(ouvrageService.findAll(actifOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OuvrageResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ouvrageService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OuvrageResponse> create(@Valid @RequestBody OuvrageRequest request) {
        OuvrageResponse response = ouvrageService.create(request);
        return ResponseEntity
                .created(URI.create("/api/ouvrages/" + response.getId()))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OuvrageResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody OuvrageRequest request) {
        return ResponseEntity.ok(ouvrageService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ouvrageService.delete(id);
    }
}