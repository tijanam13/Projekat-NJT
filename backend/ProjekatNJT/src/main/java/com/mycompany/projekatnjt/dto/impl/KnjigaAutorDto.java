package com.mycompany.projekatnjt.dto.impl;

import jakarta.validation.constraints.NotNull;

public class KnjigaAutorDto {

    @NotNull(message = "Autor je obavezan.")
    private AutorDto autor;
    @NotNull(message = "Knjiga je obavezna.")
    private KnjigaDto knjiga;

    public KnjigaAutorDto() {
    }

    public KnjigaAutorDto(AutorDto autor, KnjigaDto knjiga) {
        this.autor = autor;
        this.knjiga = knjiga;
    }

    public AutorDto getAutor() {
        return autor;
    }

    public void setAutor(AutorDto autor) {
        this.autor = autor;
    }

    public KnjigaDto getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(KnjigaDto knjiga) {
        this.knjiga = knjiga;
    }

}
