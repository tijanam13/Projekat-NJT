package com.mycompany.projekatnjt.repository.impl;

import com.mycompany.projekatnjt.entity.impl.KnjigaAutor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Repository;
import com.mycompany.projekatnjt.repository.AppRepository;

@Repository
public class KnjigaAutorRepository implements AppRepository<KnjigaAutor, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<KnjigaAutor> findAll() {
        return entityManager.createQuery("SELECT ka FROM KnjigaAutor ka", KnjigaAutor.class).getResultList();
    }

    @Override
    @Transactional
    public void save(KnjigaAutor entity) {
        entityManager.persist(entity);

    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        entityManager.createQuery("DELETE FROM KnjigaAutor ka WHERE ka.knjiga.id = :id")
                .setParameter("id", id)
                .executeUpdate();
    }

    @Override
    public KnjigaAutor findById(Long id) throws Exception {
        throw new UnsupportedOperationException("Ova klasa nema ID.");
    }

}
