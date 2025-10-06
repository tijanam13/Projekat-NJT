package com.mycompany.projekatnjt.repository.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import com.mycompany.projekatnjt.entity.impl.Knjiga;
import com.mycompany.projekatnjt.entity.impl.Zanr;
import org.springframework.stereotype.Repository;
import com.mycompany.projekatnjt.repository.AppRepository;

@Repository
public class KnjigaRepository implements AppRepository<Knjiga, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Knjiga> findAll() {
        return entityManager.createQuery(
                "SELECT DISTINCT k FROM Knjiga k "
                + "LEFT JOIN FETCH k.autori ka "
                + "LEFT JOIN FETCH ka.autor", Knjiga.class)
                .getResultList();
    }

    @Override
    public Knjiga findById(Long id) throws Exception {
        Knjiga knjiga = entityManager.createQuery(
                "SELECT k FROM Knjiga k "
                + "LEFT JOIN FETCH k.autori ka "
                + "LEFT JOIN FETCH ka.autor "
                + "WHERE k.id = :id", Knjiga.class)
                .setParameter("id", id)
                .getSingleResult();

        if (knjiga == null) {
            throw new Exception("Knjiga nije pronađena.");
        }
        return knjiga;
    }

    @Override
    @Transactional
    public void save(Knjiga k) {
        if (k.getId() == null) {
            entityManager.persist(k);
        } else {
            entityManager.merge(k);
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Knjiga k = entityManager.find(Knjiga.class, id);
        if (k != null) {
            entityManager.remove(k);
        }
    }

    public List<Knjiga> findByAuthor(Long autorId) {
        return entityManager.createQuery(
                "SELECT DISTINCT k FROM Knjiga k "
                + "JOIN k.autori ka "
                + "JOIN ka.autor a "
                + "WHERE a.id = :aid", Knjiga.class)
                .setParameter("aid", autorId)
                .getResultList();
    }

    public List<Knjiga> findByZanr(Zanr zanr) {
        return entityManager.createQuery(
                "SELECT DISTINCT k FROM Knjiga k "
                + "LEFT JOIN FETCH k.autori ka "
                + "LEFT JOIN FETCH ka.autor "
                + "WHERE k.zanr = :zanr", Knjiga.class)
                .setParameter("zanr", zanr)
                .getResultList();
    }

    public List<Knjiga> findByAutoriId(Long autorId) {
        return entityManager.createQuery(
                "SELECT DISTINCT k FROM Knjiga k "
                + "JOIN k.autori ka "
                + "JOIN ka.autor a "
                + "WHERE a.id = :autorId", Knjiga.class)
                .setParameter("autorId", autorId)
                .getResultList();
    }

    public List<Knjiga> findByZanrAndAutoriId(Zanr zanr, Long autorId) {
        return entityManager.createQuery(
                "SELECT DISTINCT k FROM Knjiga k "
                + "JOIN k.autori ka "
                + "JOIN ka.autor a "
                + "WHERE k.zanr = :zanr AND a.id = :autorId", Knjiga.class)
                .setParameter("zanr", zanr)
                .setParameter("autorId", autorId)
                .getResultList();
    }

}
