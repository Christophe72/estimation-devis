package com.estimelec.auth;

import com.estimelec.auth.dto.LoginRequest;
import com.estimelec.auth.dto.LoginResponse;
import com.estimelec.auth.dto.MeResponse;
import com.estimelec.user.Role;
import com.estimelec.user.User;
import com.estimelec.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_shouldSucceedWhenCredentialsAreValidAndUserEnabled() {
        User user = createUser(1L, "admin@estimelec.be", "encoded-pass", Role.ADMIN, true);
        LoginRequest request = LoginRequest.builder()
                .email("admin@estimelec.be")
                .password("plain-pass")
                .build();

        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-pass", "encoded-pass")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("jwt-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getUser().getEmail()).isEqualTo("admin@estimelec.be");
        assertThat(response.getUser().getRole()).isEqualTo("ADMIN");
    }

    @Test
    void login_shouldFailWhenUserNotFound() {
        LoginRequest request = LoginRequest.builder()
                .email("missing@estimelec.be")
                .password("plain-pass")
                .build();
        when(userRepository.findByEmail("missing@estimelec.be")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Email ou mot de passe invalide.");
    }

    @Test
    void login_shouldFailWhenPasswordIsIncorrect() {
        User user = createUser(1L, "admin@estimelec.be", "encoded-pass", Role.ADMIN, true);
        LoginRequest request = LoginRequest.builder()
                .email("admin@estimelec.be")
                .password("wrong-pass")
                .build();
        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-pass", "encoded-pass")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Email ou mot de passe invalide.");
    }

    @Test
    void login_shouldFailWhenUserIsDisabled() {
        User user = createUser(1L, "admin@estimelec.be", "encoded-pass", Role.ADMIN, false);
        LoginRequest request = LoginRequest.builder()
                .email("admin@estimelec.be")
                .password("plain-pass")
                .build();
        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Email ou mot de passe invalide.");
    }

    @Test
    void getCurrentUser_shouldReturnMeResponseWhenAuthenticatedUserExists() {
        User user = createUser(5L, "user@estimelec.be", "encoded-pass", Role.USER, true);
        when(authentication.getName()).thenReturn("user@estimelec.be");
        when(userRepository.findByEmail("user@estimelec.be")).thenReturn(Optional.of(user));

        MeResponse response = authService.getCurrentUser(authentication);

        assertThat(response.getId()).isEqualTo(5L);
        assertThat(response.getEmail()).isEqualTo("user@estimelec.be");
        assertThat(response.getRole()).isEqualTo("USER");
    }

    @Test
    void getCurrentUser_shouldFailWhenAuthenticatedUserNotFound() {
        when(authentication.getName()).thenReturn("missing@estimelec.be");
        when(userRepository.findByEmail("missing@estimelec.be")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.getCurrentUser(authentication))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Utilisateur authentifié introuvable.");
    }

    @Test
    void getCurrentUser_shouldFailWhenAuthenticationIsNull() {
        assertThatThrownBy(() -> authService.getCurrentUser(null))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Utilisateur non authentifié.");
    }

    private User createUser(Long id, String email, String password, Role role, boolean enabled) {
        return User.builder()
                .id(id)
                .email(email)
                .password(password)
                .prenom("Prenom")
                .nom("Nom")
                .role(role)
                .enabled(enabled)
                .build();
    }
}
