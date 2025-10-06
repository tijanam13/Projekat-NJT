package com.mycompany.projekatnjt.repository.impl;

import com.mycompany.projekatnjt.entity.impl.Korisnik;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Repository;
import com.mycompany.projekatnjt.repository.AppRepository;

@Repository
public class KorisnikRepository implements AppRepository<Korisnik, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Korisnik> findAll() {
        return entityManager.createQuery("SELECT k FROM Korisnik k", Korisnik.class).getResultList();
    }

    @Override
    public Korisnik findById(Long id) throws Exception {
        Korisnik korisnik = entityManager.find(Korisnik.class, id);
        if (korisnik == null) {
            throw new Exception("Korisnik nije pronađen.");
        }
        return korisnik;
    }

    @Override
    @Transactional
    public void save(Korisnik entity) {
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Korisnik korisnik = entityManager.find(Korisnik.class, id);
        if (korisnik != null) {
            entityManager.remove(korisnik);
        }
    }

    public Korisnik findByUsername(String username) {
        List<Korisnik> list = entityManager.createQuery("SELECT k FROM Korisnik k WHERE k.korisnickoIme = :un", Korisnik.class).setParameter("un", username).getResultList();
        return list.isEmpty() ? null : list.get(0);
    }

    public boolean existsByUsername(String username) {
        Long c = entityManager.createQuery("SELECT COUNT(k) FROM Korisnik k WHERE k.korisnickoIme = :un", Long.class).setParameter("un", username).getSingleResult();
        return c > 0;
    }

    public boolean existsByEmail(String email) {
        Long c = entityManager.createQuery("SELECT COUNT(k) FROM Korisnik k WHERE k.email = :em", Long.class).setParameter("em", email).getSingleResult();
        return c > 0;

    }

    public Korisnik findByEmail(String email) {
        List<Korisnik> list = entityManager.createQuery("SELECT k FROM Korisnik k WHERE k.email = :email", Korisnik.class)
                .setParameter("email", email).getResultList();
        return list.isEmpty() ? null : list.get(0);
    }

}
