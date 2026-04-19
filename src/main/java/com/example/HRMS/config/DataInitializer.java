package com.example.HRMS.config;

import com.example.HRMS.entity.Role;
import com.example.HRMS.entity.User;
import com.example.HRMS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Create ADMIN
        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("ADMIN CREATED");
        }

        // Create STAFF
        if (userRepository.findByUsername("staff").isEmpty()) {

            User user = new User();
            user.setUsername("staff");
            user.setPassword(passwordEncoder.encode("staff123"));
            user.setRole(Role.STAFF);

            userRepository.save(user);

            System.out.println("STAFF CREATED");
        }

        // Create MANAGER
        if (userRepository.findByUsername("manager").isEmpty()) {

            User admin = new User();
            admin.setUsername("manager");
            admin.setPassword(passwordEncoder.encode("manager123"));
            admin.setRole(Role.MANAGER);

            userRepository.save(admin);

            System.out.println("MANAGER CREATED");
        }

    }
}
