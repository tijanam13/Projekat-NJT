package com.mycompany.projekatnjt.dto.impl;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StavkaRezervacijeDto {

    private Long id;
    private Integer redniBroj;
    @NotNull(message = "Broj primeraka je obavezan.")
    @Min(value = 1, message = "Broj primeraka mora biti najmanje 1.")
    private Integer brojPrimeraka;
    private Long rezervacijaId;
    @NotNull(message = "knjigaId je obavezan.")
    private Long knjigaId;
    private KnjigaDto knjiga;

    public StavkaRezervacijeDto() {
    }

    public StavkaRezervacijeDto(Long id, Integer redniBroj, Integer brojPrimeraka, Long rezervacijaId, Long knjigaId) {
        this.id = id;
        this.redniBroj = redniBroj;
        this.brojPrimeraka = brojPrimeraka;
        this.rezervacijaId = rezervacijaId;
        this.knjigaId = knjigaId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRedniBroj() {
        return redniBroj;
    }

    public void setRedniBroj(Integer redniBroj) {
        this.redniBroj = redniBroj;
    }

    public Integer getBrojPrimeraka() {
        return brojPrimeraka;
    }

    public void setBrojPrimeraka(Integer brojPrimeraka) {
        this.brojPrimeraka = brojPrimeraka;
    }

    public Long getRezervacijaId() {
        return rezervacijaId;
    }

    public void setRezervacijaId(Long rezervacijaId) {
        this.rezervacijaId = rezervacijaId;
    }

    public Long getKnjigaId() {
        return knjigaId;
    }

    public void setKnjigaId(Long knjigaId) {
        this.knjigaId = knjigaId;
    }

    public KnjigaDto getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(KnjigaDto knjiga) {
        this.knjiga = knjiga;
    }
}
