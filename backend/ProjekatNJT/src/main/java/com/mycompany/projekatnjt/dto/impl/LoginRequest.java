package com.mycompany.projekatnjt.dto.impl;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank
    private String korisnickoIme;
    @NotBlank
    private String lozinka;

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

}
