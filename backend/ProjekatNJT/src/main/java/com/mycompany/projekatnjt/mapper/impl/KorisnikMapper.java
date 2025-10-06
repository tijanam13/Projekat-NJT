package com.mycompany.projekatnjt.mapper.impl;

import com.mycompany.projekatnjt.dto.impl.KorisnikDto;
import com.mycompany.projekatnjt.entity.impl.Korisnik;
import com.mycompany.projekatnjt.mapper.DtoEntityMapper;
import org.springframework.stereotype.Component;

@Component
public class KorisnikMapper implements DtoEntityMapper<KorisnikDto, Korisnik> {

    @Override
    public KorisnikDto toDto(Korisnik e) {
        if (e == null) {
            return null;
        }
        return new KorisnikDto(e.getId(), e.getKorisnickoIme(), e.getEmail(), e.getUloga());
    }

    @Override
    public Korisnik toEntity(KorisnikDto t) {
        if (t == null) {
            return null;
        }
        Korisnik k = new Korisnik();
        k.setId(t.getId());
        k.setKorisnickoIme(t.getKorisnickoIme());
        k.setEmail(t.getEmail());
        k.setUloga(t.getUloga());
        return k;
    }

}
