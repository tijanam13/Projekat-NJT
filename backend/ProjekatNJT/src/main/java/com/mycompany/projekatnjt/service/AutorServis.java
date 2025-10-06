package com.mycompany.projekatnjt.service;

import com.mycompany.projekatnjt.dto.impl.AutorDto;
import com.mycompany.projekatnjt.entity.impl.Autor;
import com.mycompany.projekatnjt.mapper.impl.AutorMapper;
import com.mycompany.projekatnjt.repository.impl.AutorRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AutorServis {

    private final AutorRepository autorRepository;
    private final AutorMapper autorMapper;

    @Autowired
    public AutorServis(AutorRepository autorRepository, AutorMapper autorMapper) {
        this.autorRepository = autorRepository;
        this.autorMapper = autorMapper;
    }

    public List<AutorDto> findAll() {
        return autorRepository.findAll().stream().map(autorMapper::toDto).collect(Collectors.toList());

    }

    public AutorDto findById(Long id) throws Exception {
        return autorMapper.toDto(autorRepository.findById(id));

    }

    public AutorDto create(AutorDto autorDto) {
        Autor autor = autorMapper.toEntity(autorDto);
        autorRepository.save(autor);
        return autorMapper.toDto(autor);
    }

    public void deleteById(Long id) {
        autorRepository.deleteById(id);
    }

    public AutorDto update(AutorDto autorDto) {
        Autor updated = autorMapper.toEntity(autorDto);
        autorRepository.save(updated);
        return autorMapper.toDto(updated);
    }

}
