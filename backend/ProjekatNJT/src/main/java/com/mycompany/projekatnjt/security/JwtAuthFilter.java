package com.mycompany.projekatnjt.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpMethod;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final AppUserDetailsService uds;

    public JwtAuthFilter(JwtService jwt, AppUserDetailsService uds) {
        this.jwt = jwt;
        this.uds = uds;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        if (HttpMethod.OPTIONS.name().equalsIgnoreCase(req.getMethod())) {
            System.out.println("Obrada zahteva za OPTIONS, preskačem JWT autentifikaciju.");
            chain.doFilter(req, res);
            return;
        }

        String authHeader = req.getHeader("Authorization");
        System.out.println("=== Dolazni zahtev ===");
        System.out.println("URI: " + req.getRequestURI());
        System.out.println("Authorization header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = null;

            try {
                username = jwt.extractUsername(token);
                try {
                    Date exp = jwt.extractExpiration(token);
                    System.out.println("Rok trajanja: " + exp);
                    System.out.println("Formirano: " + jwt.extractIssuedAt(token));
                } catch (Exception e) {
                    System.out.println("Nije uspelo izdvajanje roka trajanja: " + e.getMessage());
                }

            } catch (Exception e) {
                System.out.println("Greška pri obradi tokena: " + e.getMessage());
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails ud = null;
                try {
                    ud = uds.loadUserByUsername(username);
                    System.out.println("Učitan korisnik iz baze podataka: " + username);
                } catch (Exception e) {
                    System.out.println("Greška pri učitavanju korisnika: " + e.getMessage());
                }

                if (ud != null) {
                    boolean valid = jwt.isValid(token, ud);
                    System.out.println("JWT validan? " + valid);
                    System.out.println("Korisnik omogućen? " + ud.isEnabled());
                    System.out.println("Korisnik ovlašćenja: " + ud.getAuthorities());

                    if (valid && ud.isEnabled()) {
                        List<SimpleGrantedAuthority> tokenAuthorities = jwt.extractRoles(token).stream()
                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                                .toList();

                        List<SimpleGrantedAuthority> userAuthorities = ud.getAuthorities().stream()
                                .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                                .toList();

                        List<SimpleGrantedAuthority> combinedAuthorities = new ArrayList<>();
                        combinedAuthorities.addAll(tokenAuthorities);
                        combinedAuthorities.addAll(userAuthorities);

                        System.out.println("Konačna kombinovana ovlašćenja: " + combinedAuthorities);

                        UsernamePasswordAuthenticationToken at
                                = new UsernamePasswordAuthenticationToken(ud, null, combinedAuthorities);
                        at.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(at);

                        System.out.println("Autentifikacija podešena u kontekstu za korisnika: " + username);
                    } else {
                        System.out.println("Autentifikacija nije podešena. Ili je nevažeći token ili je korisnik onemogućen.");
                    }
                }
            }
        }

        chain.doFilter(req, res);
    }

}
