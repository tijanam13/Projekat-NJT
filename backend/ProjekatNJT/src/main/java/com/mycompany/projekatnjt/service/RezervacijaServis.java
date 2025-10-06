package com.mycompany.projekatnjt.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.mycompany.projekatnjt.dto.impl.RezervacijaDto;
import com.mycompany.projekatnjt.dto.impl.StavkaRezervacijeDto;
import com.mycompany.projekatnjt.entity.impl.*;
import com.mycompany.projekatnjt.mapper.impl.RezervacijaMapper;
import com.mycompany.projekatnjt.repository.impl.KorisnikRepository;
import com.mycompany.projekatnjt.repository.impl.RezervacijaRepository;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class RezervacijaServis {

    private final RezervacijaRepository rezervacije;
    private final RezervacijaMapper mapper;
    private final KorisnikRepository korisnikRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public RezervacijaServis(RezervacijaRepository orders, RezervacijaMapper mapper, KorisnikRepository korisnikRepository) {
        this.rezervacije = orders;
        this.mapper = mapper;
        this.korisnikRepository = korisnikRepository;
    }

    public List<RezervacijaDto> findAll() {
        return rezervacije.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public RezervacijaDto findById(Long id) throws Exception {
        return mapper.toDto(rezervacije.findById(id));
    }

    @Transactional
    public RezervacijaDto create(RezervacijaDto dto) throws Exception {
        Rezervacija r = new Rezervacija();
        r.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.AKTIVNO);

        r.setDatumRezervacije(dto.getDatumRezervacije() != null ? dto.getDatumRezervacije() : new Date());
        r.setRokZaPreuzimanje(dto.getRokZaPreuzimanje() != null
                ? dto.getRokZaPreuzimanje()
                : new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Korisnik korisnik = korisnikRepository.findByUsername(username);

        if (korisnik == null) {
            throw new Exception("Korisnik sa korisničkim imenom " + username + " nije pronađen nakon autentifikacije.");
        }
        r.setKorisnik(korisnik);

        if (dto.getStavke() == null || dto.getStavke().isEmpty()) {
            throw new Exception("Rezervacija mora sadržati najmanje jednu stavku");
        }

        int redniBroj = 1;
        for (StavkaRezervacijeDto it : dto.getStavke()) {
            StavkaRezervacije sr = new StavkaRezervacije();
            sr.setRedniBroj(redniBroj++);
            sr.setBrojPrimeraka(it.getBrojPrimeraka() != null ? it.getBrojPrimeraka() : 1);
            sr.setKnjiga(entityManager.getReference(Knjiga.class, it.getKnjigaId()));
            sr.setRezervacija(r);
            r.dodajStavku(sr);
        }

        rezervacije.save(r);

        return mapper.toDto(r);
    }

    @Transactional
    public RezervacijaDto updateStatus(Long id, Status status) throws Exception {
        Rezervacija r = rezervacije.findById(id);
        r.setStatus(status);
        rezervacije.save(r);
        return mapper.toDto(r);
    }


    public List<RezervacijaDto> findByKorisnikId(Long korisnikId) {
        return rezervacije.findByKorisnikId(korisnikId).stream().map(mapper::toDto).collect(Collectors.toList());

    }

    public List<RezervacijaDto> findByStatus(Status status) {
        return rezervacije.findByStatus(status)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

}
