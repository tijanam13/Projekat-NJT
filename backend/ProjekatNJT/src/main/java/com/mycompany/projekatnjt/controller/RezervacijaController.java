package com.mycompany.projekatnjt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import com.mycompany.projekatnjt.dto.impl.RezervacijaDto;
import com.mycompany.projekatnjt.entity.impl.Status;
import com.mycompany.projekatnjt.service.RezervacijaServis;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/rezervacija")
@Tag(name = "Rezervacija")
public class RezervacijaController {

    private final RezervacijaServis RezervacijaServis;

    public RezervacijaController(RezervacijaServis servis) {
        this.RezervacijaServis = servis;
    }

    @GetMapping
    public ResponseEntity<List<RezervacijaDto>> all(@RequestParam(required = false) Optional<Status> status) {
        if (status.isPresent()) {
            return new ResponseEntity<>(RezervacijaServis.findByStatus(status.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(RezervacijaServis.findAll(), HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RezervacijaDto> byId(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(RezervacijaServis.findById(id), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Kreiraj rezervaciju sa stavkama u jednoj transakciji")
    public ResponseEntity<RezervacijaDto> create(@Valid @RequestBody @NotNull RezervacijaDto dto) {
        try {
            RezervacijaDto saved = RezervacijaServis.create(dto);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Kontroler — korisnik: " + auth.getName());
            System.out.println("Kontroler — authorities: " + auth.getAuthorities());
            return new ResponseEntity<>(saved, HttpStatus.CREATED);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kreiranje rezervacije nije uspelo: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RezervacijaDto> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        try {
            return new ResponseEntity<>(RezervacijaServis.updateStatus(id, status), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/korisnik/{korisnikId}")
    public ResponseEntity<List<RezervacijaDto>> byKorisnik(@PathVariable Long korisnikId) {
        List<RezervacijaDto> rezervacije = RezervacijaServis.findByKorisnikId(korisnikId);
        return new ResponseEntity<>(rezervacije, HttpStatus.OK);
    }

}
