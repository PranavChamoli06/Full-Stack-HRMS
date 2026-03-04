package com.example.HRMS.service;

import com.example.HRMS.entity.User;
import com.example.HRMS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // ✅ Explicit entity reference to avoid any confusion
        com.example.HRMS.entity.User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found"));

        // ✅ Convert permissions to authorities
        Set<GrantedAuthority> authorities =
                user.getRole()
                        .getPermissions()
                        .stream()
                        .map(permission ->
                                new SimpleGrantedAuthority(permission.name()))
                        .collect(Collectors.toSet());

        // ✅ Add role itself as authority
        authorities.add(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}
