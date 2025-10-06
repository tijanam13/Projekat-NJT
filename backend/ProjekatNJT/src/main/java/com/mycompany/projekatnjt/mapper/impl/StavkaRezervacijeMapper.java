package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaAutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaDto;
import com.mycompany.projekatnjt.dto.impl.StavkaRezervacijeDto;
import com.mycompany.projekatnjt.entity.impl.Knjiga;
import com.mycompany.projekatnjt.entity.impl.Rezervacija;
import com.mycompany.projekatnjt.entity.impl.StavkaRezervacije;
import com.mycompany.projekatnjt.mapper.DtoEntityMapper;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class StavkaRezervacijeMapper implements DtoEntityMapper<StavkaRezervacijeDto, StavkaRezervacije> {

    @Override
    public StavkaRezervacijeDto toDto(StavkaRezervacije sr) {
        StavkaRezervacijeDto dto = new StavkaRezervacijeDto();
        dto.setId(sr.getId());
        dto.setRedniBroj(sr.getRedniBroj());
        dto.setBrojPrimeraka(sr.getBrojPrimeraka());
        dto.setRezervacijaId(sr.getRezervacija().getId());
        dto.setKnjigaId(sr.getKnjiga().getId());

        if (sr.getKnjiga() != null) {
            Knjiga k = sr.getKnjiga();
            KnjigaDto kd = new KnjigaDto();
            kd.setId(k.getId());
            kd.setNaslov(k.getNaslov());
            kd.setIzdavac(k.getIzdavac());
            kd.setGodinaIzdanja(k.getGodinaIzdanja());
            kd.setZanr(k.getZanr());
            kd.setSlika(k.getSlika());
            kd.setOpis(k.getOpis());

            List<KnjigaAutorDto> autoriDto = k.getAutori().stream().map(ka -> {
                AutorDto autorDto = new AutorDto();
                autorDto.setId(ka.getAutor().getId());
                autorDto.setIme(ka.getAutor().getIme());
                autorDto.setPrezime(ka.getAutor().getPrezime());
                autorDto.setBiografija(ka.getAutor().getBiografija());

                KnjigaAutorDto kad = new KnjigaAutorDto();
                kad.setAutor(autorDto);
                kad.setKnjiga(null);
                return kad;
            }).collect(Collectors.toList());

            kd.setAutori(autoriDto);
            dto.setKnjiga(kd);
        }

        return dto;
    }

    @Override
    public StavkaRezervacije toEntity(StavkaRezervacijeDto t) {
        Rezervacija rezervacija = t.getRezervacijaId() != null ? new Rezervacija(t.getRezervacijaId()) : null;
        Knjiga knjiga = t.getKnjigaId() != null ? new Knjiga(t.getKnjigaId()) : null;
        return new StavkaRezervacije(t.getId(), t.getRedniBroj(), t.getBrojPrimeraka(), rezervacija, knjiga);
    }
}
