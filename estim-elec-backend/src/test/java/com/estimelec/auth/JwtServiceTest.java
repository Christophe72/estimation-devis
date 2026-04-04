package com.estimelec.auth;

import com.estimelec.auth.config.JwtProperties;
import com.estimelec.user.Role;
import com.estimelec.user.User;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import io.jsonwebtoken.ExpiredJwtException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private JwtService createJwtService(long expirationSeconds) {
        JwtProperties properties = new JwtProperties();
        String secret = Base64.getEncoder()
                .encodeToString("01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8));
        properties.setSecret(secret);
        properties.setExpiration(expirationSeconds);
        return new JwtService(properties);
    }

    private User createUser(Long id, String email, Role role) {
        return User.builder()
                .id(id)
                .email(email)
                .password("encoded-password")
                .role(role)
                .enabled(true)
                .build();
    }

    @Test
    void generateToken_shouldReturnNonEmptyToken() {
        JwtService jwtService = createJwtService(3600);
        User user = createUser(1L, "admin@estimelec.be", Role.ADMIN);

        String token = jwtService.generateToken(user);

        assertThat(token).isNotBlank();
    }

    @Test
    void extractEmail_shouldReturnExpectedEmail() {
        JwtService jwtService = createJwtService(3600);
        User user = createUser(1L, "admin@estimelec.be", Role.ADMIN);
        String token = jwtService.generateToken(user);

        String extractedEmail = jwtService.extractEmail(token);

        assertThat(extractedEmail).isEqualTo("admin@estimelec.be");
    }

    @Test
    void isTokenValid_shouldReturnTrueForMatchingUser() {
        JwtService jwtService = createJwtService(3600);
        User user = createUser(1L, "admin@estimelec.be", Role.ADMIN);
        String token = jwtService.generateToken(user);

        boolean valid = jwtService.isTokenValid(token, user);

        assertThat(valid).isTrue();
    }

    @Test
    void isTokenValid_shouldReturnFalseForDifferentUser() {
        JwtService jwtService = createJwtService(3600);
        User user = createUser(1L, "admin@estimelec.be", Role.ADMIN);
        User otherUser = createUser(2L, "user@estimelec.be", Role.USER);
        String token = jwtService.generateToken(user);

        boolean valid = jwtService.isTokenValid(token, otherUser);

        assertThat(valid).isFalse();
    }

    @Test
    void isTokenExpired_shouldThrowExpiredJwtExceptionWhenExpirationIsPassed() throws InterruptedException {
        JwtService jwtService = createJwtService(1);
        User user = createUser(1L, "admin@estimelec.be", Role.ADMIN);
        String token = jwtService.generateToken(user);

        Thread.sleep(1200);

        assertThatThrownBy(() -> jwtService.isTokenExpired(token))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
