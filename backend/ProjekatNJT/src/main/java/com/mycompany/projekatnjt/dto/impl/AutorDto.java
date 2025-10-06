package com.mycompany.projekatnjt.dto.impl;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AutorDto {

    private Long id;
    @NotBlank(message = "Ime je obavezno.")
    @Size(min = 2, max = 100, message = "Ime mora imati između 2 i 100 karaktera.")
    private String ime;
    @NotBlank(message = "Prezime je obavezno.")
    @Size(min = 2, max = 100, message = "Prezime mora imati između 2 i 100 karaktera.")
    private String prezime;
    private String biografija;
    private List<KnjigaAutorDto> knjige;

    public AutorDto() {
    }

    public AutorDto(Long id, String ime, String prezime, String biografija, List<KnjigaAutorDto> knjige) {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.biografija = biografija;
        this.knjige = knjige;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getBiografija() {
        return biografija;
    }

    public void setBiografija(String biografija) {
        this.biografija = biografija;
    }

    public List<KnjigaAutorDto> getKnjige() {
        return knjige;
    }

    public void setKnjige(List<KnjigaAutorDto> knjige) {
        this.knjige = knjige;
    }

}
