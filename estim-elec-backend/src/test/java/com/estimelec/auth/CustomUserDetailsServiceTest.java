package com.estimelec.auth;

import com.estimelec.user.Role;
import com.estimelec.user.User;
import com.estimelec.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsername_shouldReturnUserDetailsForExistingAdmin() {
        User user = User.builder()
                .email("admin@estimelec.be")
                .password("encoded-pass")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin@estimelec.be");

        assertThat(userDetails.getUsername()).isEqualTo("admin@estimelec.be");
        assertThat(userDetails.isEnabled()).isTrue();
        assertThat(userDetails.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_ADMIN");
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetailsForExistingUserRole() {
        User user = User.builder()
                .email("user@estimelec.be")
                .password("encoded-pass")
                .role(Role.USER)
                .enabled(true)
                .build();
        when(userRepository.findByEmail("user@estimelec.be")).thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("user@estimelec.be");

        assertThat(userDetails.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_USER");
    }

    @Test
    void loadUserByUsername_shouldThrowWhenUserNotFound() {
        when(userRepository.findByEmail("missing@estimelec.be")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserByUsername("missing@estimelec.be"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Utilisateur introuvable");
    }

    @Test
    void loadUserByUsername_shouldReflectDisabledUser() {
        User user = User.builder()
                .email("disabled@estimelec.be")
                .password("encoded-pass")
                .role(Role.USER)
                .enabled(false)
                .build();
        when(userRepository.findByEmail("disabled@estimelec.be")).thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("disabled@estimelec.be");

        assertThat(userDetails.isEnabled()).isFalse();
    }
}
