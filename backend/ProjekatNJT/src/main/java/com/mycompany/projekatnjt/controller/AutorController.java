package com.mycompany.projekatnjt.controller;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.service.AutorServis;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/autori")
public class AutorController {

    private final AutorServis autorServis;

    public AutorController(AutorServis autorServis) {
        this.autorServis = autorServis;
    }

    @GetMapping
    @Operation(summary = "Preuzmi sve autor entitete.")
    @ApiResponse(responseCode = "200", content = {
        @Content(schema = @Schema(implementation = AutorDto.class), mediaType = "application/json")})
    public ResponseEntity<List<AutorDto>> getAll() {
        return new ResponseEntity<>(autorServis.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutorDto> getById(
            @NotNull(message = "Ne bi trebalo da bude null ili prazno.")
            @PathVariable(value = "id") Long id) {
        try {
            return new ResponseEntity<>(autorServis.findById(id), HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "AutorController izuzetak.");
        }
    }

    @PostMapping
    @Operation(summary = "Kreiraj novi entitet autor.")
    @ApiResponse(responseCode = "210", content = {
        @Content(schema = @Schema(implementation = AutorDto.class), mediaType = "application/json")})
    public ResponseEntity<AutorDto> addAutor(@Valid @RequestBody @NotNull AutorDto autorDto) {
        try {
            AutorDto saved = autorServis.create(autorDto);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Greška prilikom čuvanja autora.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable(value = "id") Long id) {
        try {
            autorServis.deleteById(id);
            return new ResponseEntity<>("Autor uspešno obrisan.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Autor koji ima id " + id + " ne postoji.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Ažuriraj postojeći Autor entitet.")
    @ApiResponse(responseCode = "200", content = {
        @Content(schema = @Schema(implementation = AutorDto.class), mediaType = "application/json")})
    public ResponseEntity<AutorDto> updateAutor(@PathVariable Long id, @Valid @RequestBody AutorDto autorDto) {
        try {
            autorDto.setId(id);
            AutorDto updated = autorServis.update(autorDto);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Greška prilikom ažuriranja autora.");
        }
    }

}
