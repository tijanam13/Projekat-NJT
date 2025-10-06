package com.mycompany.projekatnjt.entity.impl;

import jakarta.persistence.*;

@Entity
@Table(name = "korisnik", uniqueConstraints = {
    @UniqueConstraint(name = "uk_korisnik_korisnickoIme", columnNames = "korisnickoIme"),
    @UniqueConstraint(name = "uk_korisnik_email", columnNames = "email")})
public class Korisnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 50)
    private String korisnickoIme;
    @Column(nullable = false)
    private String lozinkaHash;
    @Column(nullable = false, length = 255)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Uloga uloga = Uloga.KORISNIK;

    @Column(nullable = false)
    private boolean registrovan = false;

    public Korisnik() {
    }

    public Korisnik(Long id) {
        this.id = id;
    }

    public Korisnik(Long id, String korisnickoIme, String lozinkaHash, String email) {
        this.id = id;
        this.korisnickoIme = korisnickoIme;
        this.lozinkaHash = lozinkaHash;
        this.email = email;
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

    public String getLozinkaHash() {
        return lozinkaHash;
    }

    public void setLozinkaHash(String lozinkaHash) {
        this.lozinkaHash = lozinkaHash;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

    public boolean isRegistrovan() {
        return registrovan;
    }

    public void setRegistrovan(boolean registrovan) {
        this.registrovan = registrovan;
    }

}
