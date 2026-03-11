package com.example.HRMS.controller;

import com.example.HRMS.config.JwtService;
import com.example.HRMS.dto.AuthRequest;
import com.example.HRMS.dto.AuthResponse;
import com.example.HRMS.dto.RefreshRequest;
import com.example.HRMS.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    // ================================
    // LOGIN
    // ================================
    @Operation(
            summary = "User login",
            description = "Authenticates user and returns access & refresh tokens"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request) {

        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Fetch user from database
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow();

        // Generate tokens
        String accessToken =
                jwtService.generateAccessToken(request.getUsername());

        String refreshToken =
                jwtService.generateRefreshToken(request.getUsername());

        // Return response with role
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .role(user.getRole().name())
                        .build()
        );
    }

    // ================================
    // REFRESH TOKEN
    // ================================
    @Operation(
            summary = "Refresh JWT token",
            description = "Generates a new access token using refresh token"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody RefreshRequest request) {

        String refreshToken = request.getRefreshToken();

        if (!jwtService.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtService.extractUsername(refreshToken);

        String newAccessToken =
                jwtService.generateAccessToken(username);

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build()
        );
    }
}