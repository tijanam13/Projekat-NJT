package com.mycompany.projekatnjt.security;

import com.mycompany.projekatnjt.entity.impl.Korisnik;
import com.mycompany.projekatnjt.repository.impl.KorisnikRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final KorisnikRepository users;

    public AppUserDetailsService(KorisnikRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Korisnik u = users.findByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Nije pronađen");
        }
        return new org.springframework.security.core.userdetails.User(
                u.getKorisnickoIme(),
                u.getLozinkaHash(),
                u.isRegistrovan(),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getUloga().name()))
        );
    }

}
