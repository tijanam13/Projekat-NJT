package com.mycompany.projekatnjt.repository.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import com.mycompany.projekatnjt.entity.impl.ResetLozinkeToken;
import org.springframework.stereotype.Repository;

@Repository
public class ResetujLozinkuTokenRepository {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(ResetLozinkeToken prt) {
        em.persist(prt);
    }

    public ResetLozinkeToken find(String token) {
        return em.find(ResetLozinkeToken.class, token);
    }

    @Transactional
    public void delete(ResetLozinkeToken prt) {
        em.remove(em.contains(prt) ? prt : em.merge(prt));
    }

}
