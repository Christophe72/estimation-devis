package com.estimelec.auth;

import com.estimelec.user.Role;
import com.estimelec.user.User;
import com.estimelec.user.UserRepository;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_shouldContinueWithoutAuthenticationWhenAuthorizationHeaderIsMissing() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        assertThat(response.getStatus()).isEqualTo(200);
        verify(jwtService, never()).extractEmail(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void doFilterInternal_shouldContinueWithoutAuthenticationWhenHeaderIsMalformed() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Token abc");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtService, never()).extractEmail(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void doFilterInternal_shouldSetAuthenticationWhenTokenIsValidAndContextIsEmpty() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer valid-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        User user = User.builder()
                .id(1L)
                .email("admin@estimelec.be")
                .password("encoded")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "admin@estimelec.be",
                "encoded",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        when(jwtService.extractEmail("valid-token")).thenReturn("admin@estimelec.be");
        when(customUserDetailsService.loadUserByUsername("admin@estimelec.be")).thenReturn(userDetails);
        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("valid-token", user)).thenReturn(true);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("admin@estimelec.be");
    }

    @Test
    void doFilterInternal_shouldNotSetAuthenticationWhenTokenIsInvalid() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer invalid-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        User user = User.builder()
                .id(1L)
                .email("admin@estimelec.be")
                .password("encoded")
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "admin@estimelec.be",
                "encoded",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        when(jwtService.extractEmail("invalid-token")).thenReturn("admin@estimelec.be");
        when(customUserDetailsService.loadUserByUsername("admin@estimelec.be")).thenReturn(userDetails);
        when(userRepository.findByEmail("admin@estimelec.be")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("invalid-token", user)).thenReturn(false);

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void doFilterInternal_shouldNotReplaceExistingAuthentication() throws ServletException, IOException {
        UsernamePasswordAuthenticationToken existingAuth = new UsernamePasswordAuthenticationToken(
                "already-authenticated",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        SecurityContextHolder.getContext().setAuthentication(existingAuth);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer valid-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        when(jwtService.extractEmail("valid-token")).thenReturn("admin@estimelec.be");

        jwtAuthenticationFilter.doFilter(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(existingAuth);
        verify(customUserDetailsService, never()).loadUserByUsername(org.mockito.ArgumentMatchers.anyString());
    }
}
