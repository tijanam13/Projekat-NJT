package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaDto;
import com.mycompany.projekatnjt.entity.impl.Knjiga;
import com.mycompany.projekatnjt.mapper.DtoEntityMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class KnjigaMapper implements DtoEntityMapper<KnjigaDto, Knjiga> {

    private final KnjigaAutorMapper kam;

    public KnjigaMapper(@Lazy KnjigaAutorMapper kam) {
        this.kam = kam;
    }

    @Override
    public KnjigaDto toDto(Knjiga e) {
        List autori = e.getAutori().stream()
                .map(ka -> {
                    AutorDto aDto = new AutorDto();
                    aDto.setId(ka.getAutor().getId());
                    aDto.setIme(ka.getAutor().getIme());
                    aDto.setPrezime(ka.getAutor().getPrezime());
                    return aDto;
                })
                .collect(Collectors.toList());

        return new KnjigaDto(e.getId(), e.getNaslov(), e.getIzdavac(),
                e.getGodinaIzdanja(), e.getBrojDosupnihPrimeraka(),
                e.getZanr(), e.getOpis(), e.getSlika(), autori);
    }

    @Override
    public Knjiga toEntity(KnjigaDto t) {
        Knjiga k = new Knjiga(t.getId(), t.getNaslov(), t.getIzdavac(), t.getGodinaIzdanja(), t.getBrojDosupnihPrimeraka(), t.getZanr(), t.getOpis(), t.getSlika());
        if (t.getAutori() != null) {
            t.getAutori().forEach(a -> k.dodajAutora(kam.toEntity(a)));
        } else {
            k.setAutori(new ArrayList<>());
        }
        return k;
    }

}
