package com.mycompany.projekatnjt.entity.impl;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import jakarta.persistence.*;
import java.util.ArrayList;

@Entity
@Table(name = "autor")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ime;
    private String prezime;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String biografija;

    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<KnjigaAutor> knjige = new ArrayList<>();

    public Autor() {
    }

    public Autor(Long id, String ime, String prezime, String biografija, List<KnjigaAutor> knjige) {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.biografija = biografija;
        this.knjige = knjige;
    }

    public Autor(Long id, String ime, String prezime, String biografija) {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.biografija = biografija;
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

    public List<KnjigaAutor> getKnjige() {
        return knjige;
    }

    public void setKnjige(List<KnjigaAutor> knjige) {
        this.knjige = knjige;
    }

    public void dodajKnjigu(KnjigaAutor ka) {
        ka.getKnjiga().dodajAutora(new KnjigaAutor(this, ka.getKnjiga()));
        if (!knjige.contains(ka)) {
            knjige.add(ka);
        }
    }

}
