package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.entity.impl.Autor;
import com.mycompany.projekatnjt.mapper.DtoEntityMapper;
import java.util.ArrayList;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class AutorMapper implements DtoEntityMapper<AutorDto, Autor> {

    private final KnjigaAutorMapper kam;

    public AutorMapper(@Lazy KnjigaAutorMapper kam) {
        this.kam = kam;
    }

    @Override
    public AutorDto toDto(Autor e) {
        return new AutorDto(e.getId(), e.getIme(), e.getPrezime(), e.getBiografija(), null);
    }

    @Override
    public Autor toEntity(AutorDto t) {
        Autor a = new Autor(t.getId(), t.getIme(), t.getPrezime(), t.getBiografija());
        if (t.getKnjige() != null) {
            t.getKnjige().forEach(k -> a.dodajKnjigu(kam.toEntity(k)));
        } else {
            a.setKnjige(new ArrayList<>());

        }
        return a;
    }

}
