package com.mycompany.projekatnjt.repository.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import com.mycompany.projekatnjt.entity.impl.Rezervacija;
import com.mycompany.projekatnjt.entity.impl.Status;
import org.springframework.stereotype.Repository;
import com.mycompany.projekatnjt.repository.AppRepository;

@Repository
public class RezervacijaRepository implements AppRepository<Rezervacija, Long> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Rezervacija> findAll() {
        return entityManager.createQuery("SELECT r FROM Rezervacija r", Rezervacija.class).getResultList();
    }

    @Override
    public Rezervacija findById(Long id) throws Exception {
        Rezervacija r = entityManager.find(Rezervacija.class, id);
        if (r == null) {
            throw new Exception("Rezervacija koja ima id " + id + " nije pronađena.");
        }
        return r;
    }

    @Override
    @Transactional
    public void save(Rezervacija entity) {
        if (entity.getId() == null) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Rezervacija r = entityManager.find(Rezervacija.class, id);
        if (r != null) {
            entityManager.remove(r);
        }
    }

    public List<Rezervacija> findByKorisnikId(Long korisnikId) {
        return entityManager.createQuery(
                "SELECT r FROM Rezervacija r WHERE r.korisnik.id = :korisnikId",
                Rezervacija.class
        )
                .setParameter("korisnikId", korisnikId)
                .getResultList();
    }

    public List<Rezervacija> findByStatus(Status status) {
        return entityManager.createQuery(
                "SELECT r FROM Rezervacija r WHERE r.status = :status",
                Rezervacija.class
        )
                .setParameter("status", status)
                .getResultList();
    }
}
