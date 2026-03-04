package com.example.HRMS.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EmployeeResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private LocalDateTime createdAt;
}
