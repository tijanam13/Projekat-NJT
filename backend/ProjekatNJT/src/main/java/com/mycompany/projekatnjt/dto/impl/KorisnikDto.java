package com.mycompany.projekatnjt.dto.impl;

import com.mycompany.projekatnjt.entity.impl.Uloga;

public class KorisnikDto {

    private Long id;
    private String korisnickoIme;
    private String email;
    private Uloga uloga;

    public KorisnikDto() {
    }

    public KorisnikDto(Long id, String korisnickoIme, String email, Uloga uloga) {
        this.id = id;
        this.korisnickoIme = korisnickoIme;
        this.email = email;
        this.uloga = uloga;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

}
