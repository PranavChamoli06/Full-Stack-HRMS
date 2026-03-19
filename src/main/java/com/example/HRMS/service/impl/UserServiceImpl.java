package com.example.HRMS.service.impl;

import com.example.HRMS.entity.Role;
import com.example.HRMS.entity.User;
import com.example.HRMS.repository.UserRepository;
import com.example.HRMS.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User updateUserRole(Long id, String role) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 Critical: Enum conversion
        user.setRole(Role.valueOf(role.toUpperCase()));

        return userRepository.save(user);
    }
}