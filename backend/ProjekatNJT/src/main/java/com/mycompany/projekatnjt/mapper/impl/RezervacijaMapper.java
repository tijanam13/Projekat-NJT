package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.KorisnikDto;
import com.mycompany.projekatnjt.dto.impl.RezervacijaDto;
import com.mycompany.projekatnjt.entity.impl.Korisnik;
import com.mycompany.projekatnjt.entity.impl.Rezervacija;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component
public class RezervacijaMapper {

    private final StavkaRezervacijeMapper stavkaRezervacijeMapper;

    public RezervacijaMapper(StavkaRezervacijeMapper stavkaRezervacijeMapper) {
        this.stavkaRezervacijeMapper = stavkaRezervacijeMapper;
    }

    public RezervacijaDto toDto(Rezervacija rezervacija) {
        if (rezervacija == null) {
            return null;
        }

        RezervacijaDto dto = new RezervacijaDto();
        dto.setId(rezervacija.getId());
        dto.setDatumRezervacije(rezervacija.getDatumRezervacije());
        dto.setRokZaPreuzimanje(rezervacija.getRokZaPreuzimanje());
        dto.setStatus(rezervacija.getStatus());

        if (rezervacija.getKorisnik() != null) {
            Korisnik korisnikEntity = rezervacija.getKorisnik();
            dto.setKorisnik(new KorisnikDto(
                    korisnikEntity.getId(),
                    korisnikEntity.getKorisnickoIme(),
                    korisnikEntity.getEmail(),
                    korisnikEntity.getUloga()
            ));
        }

        if (rezervacija.getStavke() != null && !rezervacija.getStavke().isEmpty()) {
            dto.setStavke(rezervacija.getStavke().stream()
                    .map(stavkaRezervacijeMapper::toDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setStavke(java.util.Collections.emptyList());
        }

        return dto;
    }

    public Rezervacija toEntity(RezervacijaDto dto) {
        if (dto == null) {
            return null;
        }

        Rezervacija entity = new Rezervacija();
        entity.setId(dto.getId());
        entity.setDatumRezervacije(dto.getDatumRezervacije() != null ? new Date(dto.getDatumRezervacije().getTime()) : null);
        entity.setRokZaPreuzimanje(dto.getRokZaPreuzimanje() != null ? new Date(dto.getRokZaPreuzimanje().getTime()) : null);
        entity.setStatus(dto.getStatus());

        if (dto.getKorisnik() != null && dto.getKorisnik().getId() != null) {
            entity.setKorisnik(new Korisnik(dto.getKorisnik().getId()));
        }

        if (dto.getStavke() != null && !dto.getStavke().isEmpty()) {
            entity.setStavke(dto.getStavke().stream()
                    .map(stavkaRezervacijeMapper::toEntity)
                    .collect(Collectors.toList()));
            entity.getStavke().forEach(stavka -> stavka.setRezervacija(entity));
        }

        return entity;
    }
}
