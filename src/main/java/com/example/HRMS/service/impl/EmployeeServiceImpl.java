package com.example.HRMS.service.impl;

import com.example.HRMS.dto.ApiResponse;
import com.example.HRMS.dto.EmployeeRequest;
import com.example.HRMS.dto.EmployeeResponse;
import com.example.HRMS.entity.Employee;
import com.example.HRMS.exception.ResourceNotFoundException;
import com.example.HRMS.repository.EmployeeRepository;
import com.example.HRMS.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.extern.slf4j.Slf4j;
import com.example.HRMS.entity.AuditLog;
import com.example.HRMS.repository.AuditLogRepository;


import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public ApiResponse<EmployeeResponse> create(EmployeeRequest request) {

        String currentUser =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());

        Employee saved = employeeRepository.save(employee);

        log.info("Employee created successfully. ID: {} by: {}",
                saved.getId(),
                currentUser);

        // Create audit entry
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(currentUser);
        auditLog.setAction("CREATE_EMPLOYEE");
        auditLog.setDetails("Employee ID: " + saved.getId());

        auditLogRepository.save(auditLog);

        return ApiResponse.success(mapToResponse(saved));
    }

    @Override
    public ApiResponse<List<EmployeeResponse>> getAll() {

        List<EmployeeResponse> employees = employeeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.success(employees);
    }

    @Override
    public ApiResponse<EmployeeResponse> getById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + id)
                );

        return ApiResponse.success(mapToResponse(employee));
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .createdAt(employee.getCreatedAt())
                .build();
    }
}
