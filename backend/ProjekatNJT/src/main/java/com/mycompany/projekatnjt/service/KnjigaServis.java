package com.mycompany.projekatnjt.service;

import com.mycompany.projekatnjt.dto.impl.KnjigaAutorDto;
import com.mycompany.projekatnjt.dto.impl.KnjigaDto;
import com.mycompany.projekatnjt.entity.impl.Autor;
import com.mycompany.projekatnjt.entity.impl.Knjiga;
import com.mycompany.projekatnjt.entity.impl.KnjigaAutor;
import com.mycompany.projekatnjt.entity.impl.Zanr;
import com.mycompany.projekatnjt.mapper.impl.KnjigaMapper;
import com.mycompany.projekatnjt.repository.impl.AutorRepository;
import com.mycompany.projekatnjt.repository.impl.KnjigaAutorRepository;
import com.mycompany.projekatnjt.repository.impl.KnjigaRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KnjigaServis {

    private final KnjigaRepository knjigaRepository;
    private final KnjigaMapper knjigaMapper;
    private final KnjigaAutorRepository knjigaAutorRepository;
    private final AutorRepository autorRepository;

    @Autowired
    public KnjigaServis(KnjigaRepository knjigaRepository, KnjigaMapper knjigaMapper, KnjigaAutorRepository knjigaAutorRepository, AutorRepository autorRepository) {
        this.knjigaRepository = knjigaRepository;
        this.knjigaMapper = knjigaMapper;
        this.knjigaAutorRepository = knjigaAutorRepository;
        this.autorRepository = autorRepository;
    }

    @Transactional
    public void addAuthorsToBook(List<KnjigaAutorDto> lista) throws Exception {
        for (KnjigaAutorDto dto : lista) {
            Knjiga k = knjigaRepository.findById(dto.getKnjiga().getId());
            if (k == null) {
                throw new RuntimeException("Knjiga koja ima ID " + dto.getKnjiga().getId() + " ne postoji");
            }

            Autor a = autorRepository.findById(dto.getAutor().getId());
            if (a == null) {
                throw new RuntimeException("Autor koji ima ID " + dto.getAutor().getId() + " ne postoji");
            }

            KnjigaAutor ka = new KnjigaAutor(a, k);

            knjigaAutorRepository.save(ka);
        }
    }

    public List<KnjigaDto> findAll() {
        return knjigaRepository.findAll().stream().map(knjigaMapper::toDto).collect(Collectors.toList());

    }

    public KnjigaDto create(KnjigaDto knjigaDto) {
        Knjiga knjiga = knjigaMapper.toEntity(knjigaDto);
        knjigaRepository.save(knjiga);
        return knjigaMapper.toDto(knjiga);
    }

    public void deleteById(Long id) {
        knjigaRepository.deleteById(id);
    }

    @Transactional
    public KnjigaDto update(KnjigaDto knjigaDto) {
        Knjiga updated = knjigaMapper.toEntity(knjigaDto);
        knjigaAutorRepository.deleteById(updated.getId());
        knjigaRepository.save(updated);
        return knjigaMapper.toDto(updated);
    }

    public List<KnjigaDto> findByAuthor(Long autorId) {
        return knjigaRepository.findByAuthor(autorId)
                .stream()
                .map(knjigaMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<KnjigaDto> findByFilter(Zanr zanr, Long autorId) {
        List<Knjiga> knjige;

        if (zanr != null && autorId != null) {
            knjige = knjigaRepository.findByZanrAndAutoriId(zanr, autorId);
        } else if (zanr != null) {
            knjige = knjigaRepository.findByZanr(zanr);
        } else if (autorId != null) {
            knjige = knjigaRepository.findByAutoriId(autorId);
        } else {
            knjige = knjigaRepository.findAll();
        }

        return knjige.stream()
                .map(knjigaMapper::toDto)
                .collect(Collectors.toList());
    }

}
