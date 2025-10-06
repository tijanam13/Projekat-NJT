package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaAutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaDto;
import com.mycompany.projekatnjt.entity.impl.KnjigaAutor;
import com.mycompany.projekatnjt.mapper.DtoEntityMapper;
import org.springframework.stereotype.Component;

@Component
public class KnjigaAutorMapper implements DtoEntityMapper<KnjigaAutorDto, KnjigaAutor> {

    private final AutorMapper am;
    private final KnjigaMapper km;

    public KnjigaAutorMapper(AutorMapper am, KnjigaMapper km) {
        this.am = am;
        this.km = km;
    }

    @Override
    public KnjigaAutorDto toDto(KnjigaAutor e) {
        AutorDto autor = new AutorDto(e.getAutor().getId(), e.getAutor().getIme(), e.getAutor().getPrezime(), null, null);
        KnjigaDto knjiga = new KnjigaDto(e.getKnjiga().getId(), e.getKnjiga().getNaslov(), e.getKnjiga().getIzdavac(), e.getKnjiga().getGodinaIzdanja(), e.getKnjiga().getBrojDosupnihPrimeraka(), e.getKnjiga().getZanr(), e.getKnjiga().getOpis(), e.getKnjiga().getSlika(), null);
        return new KnjigaAutorDto(autor, knjiga);
    }

    @Override
    public KnjigaAutor toEntity(KnjigaAutorDto t) {
        return new KnjigaAutor(am.toEntity(t.getAutor()), km.toEntity(t.getKnjiga()));

    }

}
