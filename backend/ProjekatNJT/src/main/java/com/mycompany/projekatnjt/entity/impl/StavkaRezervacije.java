package com.mycompany.projekatnjt.entity.impl;

import jakarta.persistence.*;

@Entity
@Table(name = "stavka_rezervacije")
public class StavkaRezervacije {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Integer redniBroj;
    @Column(nullable = false)
    private Integer brojPrimeraka;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "rezervacijaId", nullable = false)
    private Rezervacija rezervacija;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "knjigaId", nullable = false)
    private Knjiga knjiga;

    public StavkaRezervacije() {
    }

    public StavkaRezervacije(Long id, Integer redniBroj, Integer brojPrimeraka, Rezervacija rezervacija, Knjiga knjiga) {
        this.id = id;
        this.redniBroj = redniBroj;
        this.brojPrimeraka = brojPrimeraka;
        this.rezervacija = rezervacija;
        this.knjiga = knjiga;
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

    public Rezervacija getRezervacija() {
        return rezervacija;
    }

    public void setRezervacija(Rezervacija rezervacija) {
        this.rezervacija = rezervacija;
    }

    public Knjiga getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(Knjiga knjiga) {
        this.knjiga = knjiga;
    }

}
