package com.mycompany.projekatnjt.service;

import jakarta.transaction.Transactional;
import com.mycompany.projekatnjt.dto.impl.*;
import com.mycompany.projekatnjt.entity.impl.Uloga;
import com.mycompany.projekatnjt.entity.impl.Korisnik;
import com.mycompany.projekatnjt.mapper.impl.KorisnikMapper;
import com.mycompany.projekatnjt.repository.impl.KorisnikRepository;
import com.mycompany.projekatnjt.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.mycompany.projekatnjt.entity.impl.ResetLozinkeToken;
import com.mycompany.projekatnjt.entity.impl.VerifikacioniToken;
import com.mycompany.projekatnjt.repository.impl.ResetujLozinkuTokenRepository;
import com.mycompany.projekatnjt.repository.impl.VerifikacioniTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class AuthServis {

    private final AuthenticationManager authManager;
    private final JwtService jwt;
    private final KorisnikRepository users;
    private final VerifikacioniTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final KorisnikMapper userMapper;
    private final ResetujLozinkuTokenRepository resetTokens;
    private final MailServis mail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    public AuthServis(AuthenticationManager authManager, JwtService jwt, KorisnikRepository users,
            VerifikacioniTokenRepository tokens, PasswordEncoder encoder,
            KorisnikMapper userMapper, ResetujLozinkuTokenRepository resetTokens, MailServis mail) {
        this.authManager = authManager;
        this.jwt = jwt;
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
        this.userMapper = userMapper;
        this.resetTokens = resetTokens;
        this.mail = mail;
    }

    @Transactional
    public KorisnikDto register(RegisterRequest req) throws Exception {
        if (users.existsByUsername(req.getKorisnickoIme())) {
            throw new Exception("Korisničko ime je zauzeto");
        }
        if (users.existsByEmail(req.getEmail())) {
            throw new Exception("Email je već u upotrebi");
        }

        Korisnik u = new Korisnik();
        u.setKorisnickoIme(req.getKorisnickoIme());
        u.setEmail(req.getEmail());
        u.setLozinkaHash(encoder.encode(req.getLozinka()));
        u.setUloga(Uloga.KORISNIK);
        u.setRegistrovan(false);

        users.save(u);

        VerifikacioniToken vt = VerifikacioniToken.of(u, 86400);
        tokens.save(vt);
        System.out.println("Generisan token: " + vt.getToken());
        System.out.println("Za korisnika: " + vt.getKorisnik().getKorisnickoIme());

        String verifyUrl = frontendUrl + "/verifikuj?token=" + URLEncoder.encode(vt.getToken(), StandardCharsets.UTF_8);
        String html = buildVerifyEmailHtml(u.getKorisnickoIme(), verifyUrl);
        mail.sendHtml(u.getEmail(), "Potvrda naloga", html);

        return userMapper.toDto(u);
    }

    private String buildVerifyEmailHtml(String username, String link) {
        return """
        <div style="font-family: Inter,Segoe UI,Arial,sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background:#cef9f2ff;">
          <div style="background:#ffffff; border:1px solid #ab92bfff; border-radius:14px; padding:24px;">
            <h2 style="margin:0 0 8px; color:#ab92bfff;">Pozdrav %s,</h2>
            <p style="margin:0 0 16px; color:#000000;">Hvala na registraciji. Kliknite na dugme ispod da potvrdite svoj nalog.</p>
            <div style="text-align:center; margin:24px 0;">
              <a href="%s" style="display:inline-block; padding:12px 18px; background:#655a7cff; color:#FFFFFF; text-decoration:none; border-radius:10px; font-weight:700; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                Potvrdi nalog
              </a>
            </div>
            <p style="margin:0 0 6px; color:#655a7cff; font-size:14px;">Ako dugme ne radi, otvori sledeći link u pregledaču:</p>
            <p style="margin:0; word-break:break-all; color:#4b0082; font-size:13px;">%s</p>
            <hr style="border:none; border-top:1px solid #ab92bfff; margin:20px 0;">
            <p style="margin:0; color:#655a7cff; font-size:12px;">Link važi 24 sata.</p>
          </div>
        </div>
        """.formatted(username, link, link);
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getKorisnickoIme(), req.getLozinka())
        );

        Korisnik me = users.findByUsername(req.getKorisnickoIme());
        if (me == null) {
            throw new RuntimeException("Korisnik ne postoji");
        }
        if (!me.isRegistrovan()) {
            throw new RuntimeException("Nalog nije aktiviran");
        }

        Map<String, Object> extra = Map.of(
                "role", java.util.List.of(me.getUloga().name())
        );

        String token = jwt.generate(
                new org.springframework.security.core.userdetails.User(
                        me.getKorisnickoIme(),
                        me.getLozinkaHash(),
                        java.util.List.of(new SimpleGrantedAuthority("ROLE_" + me.getUloga().name()))
                ),
                extra
        );

        return new AuthResponse(token, userMapper.toDto(me));
    }

    @Transactional
    public AuthResponse verifyEmail(String token) {
        VerifikacioniToken vt = tokens.find(token);
        if (vt == null) {
            throw new RuntimeException("Neispravan token.");
        }
        if (vt.isRokTrajanja()) {
            tokens.delete(vt);
            throw new RuntimeException("Token je istekao.");
        }

        Korisnik u = vt.getKorisnik();
        u.setRegistrovan(true);
        users.save(u);
        tokens.delete(vt);

        Map<String, Object> extra = Map.of(
                "role", java.util.List.of(u.getUloga().name())
        );

        String jwtToken = jwt.generate(
                new org.springframework.security.core.userdetails.User(
                        u.getKorisnickoIme(),
                        u.getLozinkaHash(),
                        java.util.List.of(new SimpleGrantedAuthority("ROLE_" + u.getUloga().name()))
                ),
                extra
        );

        return new AuthResponse(jwtToken, userMapper.toDto(u));
    }

    @Transactional
    public void requestPasswordReset(String email) {
        Korisnik u = users.findByEmail(email);
        if (u == null) {
            return;
        }

        ResetLozinkeToken t = ResetLozinkeToken.of(u, 1800);
        resetTokens.save(t);

        String link = frontendUrl + "/reset-lozinke?token=" + URLEncoder.encode(t.getToken(), StandardCharsets.UTF_8);
        String html = buildResetEmailHtml(u.getKorisnickoIme(), link);
        mail.sendHtml(u.getEmail(), "Reset lozinke", html);
    }

    private String buildResetEmailHtml(String username, String link) {
        return """
        <div style="font-family: Inter,Segoe UI,Arial,sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background:#cef9f2ff;">
          <div style="background:#ffffff; border:1px solid #ab92bfff; border-radius:14px; padding:24px;">
            <h2 style="margin:0 0 8px; color:#ab92bfff;">Pozdrav %s,</h2>
            <p style="margin:0 0 16px; color:#000000;">Poslali ste zahtev za reset lozinke. Kliknite na dugme ispod kako biste postavili novu lozinku.</p>
            <div style="text-align:center; margin:24px 0;">
              <a href="%s" style="display:inline-block; padding:12px 18px; background: #655a7cff; color:#ffffff; text-decoration:none; border-radius:10px; font-weight:700; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                Postavi novu lozinku
              </a>
            </div>
            <p style="margin:0 0 6px; color:#655a7cff; font-size:14px;">Ako dugme ne radi, otvori sledeći link u pregledaču:</p>
            <p style="margin:0; word-break:break-all; color:#4b0082; font-size:13px;">%s</p>
            <hr style="border:none; border-top:1px solid #ab92bfff; margin:20px 0;">
            <p style="margin:0; color:#655a7cff; font-size:12px;">Ovaj link važi 30 minuta.</p>
          </div>
        </div>
        """.formatted(username, link, link);
    }

    @Transactional
    public void resetPassword(String token, String password) {
        ResetLozinkeToken t = resetTokens.find(token);
        if (t == null || t.isKoriscen()|| t.isRokTrajanja()) {
            throw new RuntimeException("Neispravan ili istekao token.");
        }
        Korisnik u = t.getKorisnik();
        u.setLozinkaHash(encoder.encode(password));
        users.save(u);

        t.setKoriscen(true);
        resetTokens.save(t);
    }

    public Korisnik findByUsername(String name) {
        return users.findByUsername(name);
    }
}
