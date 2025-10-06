package com.mycompany.projekatnjt.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(UserDetails user, Map<String, Object> extra) {
        Date now = new Date();
        System.out.println("Trenutni datum: " + now);

        Date exp = new Date(now.getTime() + expirationMs);
        System.out.println("Token ističe: " + exp);

        Map<String, Object> claims = new HashMap<>();
        if (extra != null) {
            claims.putAll(extra);
        }
        claims.put("jti", UUID.randomUUID().toString());

        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .addClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

        System.out.println("Generisan JWT za korisnika " + user.getUsername() + ": " + token);
        return token;
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            final String un = extractUsername(token);
            return un.equals(user.getUsername())
                    && !isExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        Date exp = Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getExpiration();
        return exp.before(new Date());
    }

    public List<String> extractRoles(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token)
                .getBody();

        Object roleObj = claims.get("role");
        List<String> roles = new ArrayList<>();

        if (roleObj instanceof String roleStr) {
            if (roleStr.equalsIgnoreCase("USER")) {
                roles.add("KORISNIK");
            } else {
                roles.add(roleStr.toUpperCase());
            }
        } else if (roleObj instanceof List<?> list) {
            for (Object r : list) {
                if (r instanceof String s) {
                    if (s.equalsIgnoreCase("USER")) {
                        roles.add("KORISNIK");
                    } else {
                        roles.add(s.toUpperCase());
                    }
                }
            }
        }

        return roles;
    }

    public Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    public Date extractIssuedAt(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getIssuedAt();
    }

}
