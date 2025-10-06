package com.mycompany.projekatnjt.dto.impl;

import com.mycompany.projekatnjt.entity.impl.Zanr;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public class KnjigaDto {

    private Long id;
    @NotBlank(message = "Naslov je obavezan.")
    @Size(min = 1, max = 200, message = "Naslov mora imati između 1 i 200 karaktera.")
    private String naslov;
    @NotBlank(message = "Izdavač je obavezan.")
    @Size(min = 1, max = 200, message = "Izdavač mora imati između 1 i 200 karaktera.")
    private String izdavac;
    @NotNull(message = "Godina izdanja je obavezna.")
    @Positive(message = "Godina izdanja mora biti veća od 0.")
    private Integer godinaIzdanja;
    @NotNull(message = "Broj dostupnih primeraka je obavezan.")
    private Integer brojDosupnihPrimeraka;
    private Zanr zanr;
    private String slika;
    private String opis;
    private List<KnjigaAutorDto> autori;

    public KnjigaDto() {
    }

    public KnjigaDto(Long id, String naslov, String izdavac, Integer godinaIzdanja, Integer brojDosupnihPrimeraka, Zanr zanr, String opis, String slika, List<KnjigaAutorDto> autor) {
        this.id = id;
        this.naslov = naslov;
        this.izdavac = izdavac;
        this.godinaIzdanja = godinaIzdanja;
        this.brojDosupnihPrimeraka = brojDosupnihPrimeraka;
        this.zanr = zanr;
        this.autori = autor;
        this.slika = slika;
        this.opis = opis;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNaslov() {
        return naslov;
    }

    public void setNaslov(String naslov) {
        this.naslov = naslov;
    }

    public String getIzdavac() {
        return izdavac;
    }

    public void setIzdavac(String izdavac) {
        this.izdavac = izdavac;
    }

    public Integer getGodinaIzdanja() {
        return godinaIzdanja;
    }

    public void setGodinaIzdanja(Integer godinaIzdanja) {
        this.godinaIzdanja = godinaIzdanja;
    }

    public Integer getBrojDosupnihPrimeraka() {
        return brojDosupnihPrimeraka;
    }

    public void setBrojDosupnihPrimeraka(Integer brojDosupnihPrimeraka) {
        this.brojDosupnihPrimeraka = brojDosupnihPrimeraka;
    }

    public Zanr getZanr() {
        return zanr;
    }

    public void setZanr(Zanr zanr) {
        this.zanr = zanr;
    }

    public String getSlika() {
        return slika;
    }

    public void setSlika(String slika) {
        this.slika = slika;
    }

    public List<KnjigaAutorDto> getAutori() {
        return autori;
    }

    public void setAutori(List<KnjigaAutorDto> autori) {
        this.autori = autori;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

}
