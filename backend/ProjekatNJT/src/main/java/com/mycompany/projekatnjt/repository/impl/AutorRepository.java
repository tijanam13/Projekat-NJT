package com.mycompany.projekatnjt.repository.impl;

import com.mycompany.projekatnjt.entity.impl.Autor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Repository;
import com.mycompany.projekatnjt.repository.AppRepository;

@Repository
public class AutorRepository implements AppRepository<Autor, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Autor> findAll() {
        return entityManager.createQuery("SELECT a FROM Autor a", Autor.class).getResultList();
    }

    @Override
    public Autor findById(Long id) throws Exception {
        Autor autor = entityManager.find(Autor.class, id);
        if (autor == null) {
            throw new Exception("Autor nije pronađen.");
        }
        return autor;
    }

    @Override
    @Transactional
    public void save(Autor entity) {
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Autor autor = entityManager.find(Autor.class, id);
        if (autor != null) {
            entityManager.remove(autor);
        }
    }

}
