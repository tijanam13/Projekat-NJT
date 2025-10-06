package com.mycompany.projekatnjt.repository.impl;

import com.mycompany.projekatnjt.entity.impl.VerifikacioniToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class VerifikacioniTokenRepository {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(VerifikacioniToken vt) {
        em.persist(vt);
    }

    public VerifikacioniToken find(String token) {
        return em.find(VerifikacioniToken.class, token);
    }

    @Transactional
    public void delete(VerifikacioniToken vt) {
        em.remove(em.contains(vt) ? vt : em.merge(vt));
    }
}
