package com.example.HRMS.controller;

import com.example.HRMS.entity.User;
import com.example.HRMS.repository.UserRepository;
import com.example.HRMS.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/role")
    public User updateUserRole(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request
    ) {
        return userService.updateUserRole(id, request.get("role"));
    }
}