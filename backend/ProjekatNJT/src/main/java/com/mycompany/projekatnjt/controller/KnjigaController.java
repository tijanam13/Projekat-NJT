package com.mycompany.projekatnjt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import com.mycompany.projekatnjt.dto.impl.KnjigaDto;
import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaAutorDto;
import com.mycompany.projekatnjt.entity.impl.Zanr;
import com.mycompany.projekatnjt.service.KnjigaServis;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/knjiga")
public class KnjigaController {

    private final KnjigaServis knjigaServis;

    public KnjigaController(KnjigaServis knjigaServis) {
        this.knjigaServis = knjigaServis;
    }

    @GetMapping()
    @Operation(summary = "Vrati sve knjiga entitete.")
    public ResponseEntity<List<KnjigaDto>> getAll() {
        return new ResponseEntity<>(knjigaServis.findAll(), HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Kreiraj novu knjigu.")
    public ResponseEntity<KnjigaDto> addBook(
            @Valid @RequestBody KnjigaDto knjigaDto) {
        try {
            KnjigaDto saved = knjigaServis.create(knjigaDto);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Greška prilikom čuvanja knjige: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable(value = "id") Long id) {
        try {
            knjigaServis.deleteById(id);
            return new ResponseEntity<>("Knjiga je uspešno obrisana.", HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>("Knjiga koja ima id " + id + " ne postoji", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Ažurirajte postojeći enitet knjige.")
    @ApiResponse(responseCode = "200", content = {
        @Content(schema = @Schema(implementation = AutorDto.class), mediaType = "application/json")
    })
    public ResponseEntity<KnjigaDto> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody KnjigaDto knjigaDto) {
        try {
            knjigaDto.setId(id);
            KnjigaDto updated = knjigaServis.update(knjigaDto);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Greška prilikom ažuriranja knjige: " + ex.getMessage());
        }
    }

    @GetMapping("/autor/{autorId}")
    @Operation(summary = "Vrati sve knjige koje je napisao dati autor.")
    public ResponseEntity<List<KnjigaDto>> getByAuthor(@PathVariable Long autorId) {
        List<KnjigaDto> knjige = knjigaServis.findByAuthor(autorId);
        return new ResponseEntity<>(knjige, HttpStatus.OK);
    }

    @PostMapping("/autor")
    @Operation(summary = "Dodaj autore za knjigu u tabelu knjiga_autor")
    public ResponseEntity<String> addAuthorsToBook(@RequestBody List<KnjigaAutorDto> lista) {
        try {
            knjigaServis.addAuthorsToBook(lista);
            return new ResponseEntity<>("Autori uspešno dodati.", HttpStatus.OK);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Greška prilikom dodavanja autora: " + ex.getMessage());
        }
    }

    @GetMapping("/filter")
    @Operation(summary = "Vrati knjige po filteru (zanr i/ili autor).")
    public ResponseEntity<List<KnjigaDto>> getFiltered(
            @RequestParam(required = false) String zanr,
            @RequestParam(required = false) Long autorId) {

        Zanr zanrEnum = null;
        if (zanr != null && !zanr.isEmpty()) {
            try {
                zanrEnum = Zanr.valueOf(zanr);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nevažeći žanr");
            }
        }

        List<KnjigaDto> knjige = knjigaServis.findByFilter(zanrEnum, autorId);
        return new ResponseEntity<>(knjige, HttpStatus.OK);
    }
}
