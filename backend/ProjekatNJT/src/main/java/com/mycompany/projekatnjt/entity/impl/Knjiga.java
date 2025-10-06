package com.mycompany.projekatnjt.entity.impl;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import jakarta.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "knjiga")
public class Knjiga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naslov;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String opis;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String slika;
    private String izdavac;
    private Integer godinaIzdanja;
    private Integer brojDosupnihPrimeraka;
    @Enumerated(EnumType.STRING)
    @Column(name = "zanr")
    private Zanr zanr;
    @OneToMany(mappedBy = "knjiga", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<KnjigaAutor> autori = new ArrayList<>();

    public Knjiga() {
    }

    public Knjiga(Long id) {
        this.id = id;
    }

    public Knjiga(Long id, String naslov, String izdavac, Integer godinaIzdanja, Integer brojDosupnihPrimeraka, String slika, String opis, Zanr zanr, List<KnjigaAutor> autori) {
        this.id = id;
        this.naslov = naslov;
        this.izdavac = izdavac;
        this.godinaIzdanja = godinaIzdanja;
        this.brojDosupnihPrimeraka = brojDosupnihPrimeraka;
        this.zanr = zanr;
        this.autori = autori;
        this.slika = slika;
        this.opis = opis;
    }

    public Knjiga(Long id, String naslov, String izdavac, Integer godinaIzdanja, Integer brojDosupnihPrimeraka, Zanr zanr, String opis, String slika) {
        this.id = id;
        this.naslov = naslov;
        this.izdavac = izdavac;
        this.godinaIzdanja = godinaIzdanja;
        this.brojDosupnihPrimeraka = brojDosupnihPrimeraka;
        this.zanr = zanr;
        this.opis = opis;
        this.slika = slika;
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

    public List<KnjigaAutor> getAutori() {
        return autori;
    }

    public void setAutori(List<KnjigaAutor> autori) {
        this.autori = autori;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public void dodajAutora(KnjigaAutor ka) {
        ka.getAutor().dodajKnjigu(new KnjigaAutor(ka.getAutor(), this));
        if (!autori.contains(ka)) {
            this.autori.add(ka);
        }
    }

}
