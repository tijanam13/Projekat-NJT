package com.mycompany.projekatnjt.entity.impl;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "knjiga_autor")
public class KnjigaAutor {

    @EmbeddedId
    private KnjigaAutorId id;

    @ManyToOne
    @MapsId("autorId")
    @JoinColumn(name = "autor_id")
    @JsonBackReference
    private Autor autor;

    @ManyToOne
    @MapsId("knjigaId")
    @JoinColumn(name = "knjiga_id")
    @JsonBackReference
    private Knjiga knjiga;

    public KnjigaAutor() {
    }

    public KnjigaAutor(Autor autor, Knjiga knjiga) {
        this.autor = autor;
        this.knjiga = knjiga;
        this.id = new KnjigaAutorId(knjiga.getId(), autor.getId());
    }

    public KnjigaAutorId getId() {
        return id;
    }

    public void setId(KnjigaAutorId id) {
        this.id = id;
    }

    public Autor getAutor() {
        return autor;
    }

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public Knjiga getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(Knjiga knjiga) {
        this.knjiga = knjiga;
    }

}
