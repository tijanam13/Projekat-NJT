package com.mycompany.projekatnjt.entity.impl;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reset_lozinke_tokeni")
public class ResetLozinkeToken {

    @Id
    private String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Korisnik korisnik;

    @Column(nullable = false)
    private Instant rokTrajanja;

    @Column(nullable = false)
    private boolean koriscen = false;

    public static ResetLozinkeToken of(Korisnik u, long ttlSeconds) {
        ResetLozinkeToken t = new ResetLozinkeToken();
        t.token = UUID.randomUUID().toString();
        t.korisnik = u;
        t.rokTrajanja = Instant.now().plusSeconds(ttlSeconds);
        t.koriscen = false;
        return t;
    }

    public boolean isRokTrajanja() {
        return Instant.now().isAfter(rokTrajanja);
    }

    public String getToken() {
        return token;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public Instant getRokTrajanja() {
        return rokTrajanja;
    }

    public boolean isKoriscen() {
        return koriscen;
    }

    public void setKoriscen(boolean koriscen) {
        this.koriscen = koriscen;
    }
}
