package com.mycompany.projekatnjt.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import com.mycompany.projekatnjt.dto.impl.*;
import com.mycompany.projekatnjt.entity.impl.Korisnik;
import com.mycompany.projekatnjt.repository.impl.KorisnikRepository;
import com.mycompany.projekatnjt.repository.impl.VerifikacioniTokenRepository;
import com.mycompany.projekatnjt.service.AuthServis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth")
public class AuthController {

    private final AuthServis authServis;

    public AuthController(AuthServis authService) {
        this.authServis = authService;

    }

    @PostMapping("/register")
    public ResponseEntity<KorisnikDto> register(@Valid @RequestBody RegisterRequest req) throws Exception {
        return ResponseEntity.ok(authServis.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authServis.login(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<KorisnikDto> me(Authentication auth) throws Exception {
        Korisnik u = authServis.findByUsername(auth.getName());
        KorisnikDto dto = new KorisnikDto(u.getId(), u.getKorisnickoIme(), u.getEmail(), u.getUloga());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Token nije prosleđen."
            ));
        }

        try {
            AuthResponse res = authServis.verifyEmail(token);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Nalog uspešno aktiviran.",
                    "token", res.getToken(),
                    "korisnik", res.getKorisnik()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authServis.requestPasswordReset(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");
        if (password == null || password.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lozinka mora imati najmanje 6 karaktera.");
        }
        authServis.resetPassword(token, password);
        return ResponseEntity.ok("Lozinka je uspešno promenjena. Sada se možete prijaviti.");
    }

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/kontakt")
    public ResponseEntity<?> sendKontaktEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String poruka = body.get("poruka");
        if (email == null || poruka == null) {
            return ResponseEntity.badRequest().body("Sva polja su obavezna.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("biblioteka1303@gmail.com");
            message.setSubject("Nova poruka sa kontakt forme");
            message.setText("Od: " + email + "\n\n" + poruka);
            mailSender.send(message);
            return ResponseEntity.ok("Poruka poslata!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Greška pri slanju poruke.");
        }
    }
}
