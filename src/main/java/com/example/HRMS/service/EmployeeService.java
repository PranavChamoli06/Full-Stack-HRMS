package com.example.HRMS.service;

import com.example.HRMS.dto.ApiResponse;
import com.example.HRMS.dto.EmployeeRequest;
import com.example.HRMS.dto.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    ApiResponse<EmployeeResponse> create(EmployeeRequest request);

    ApiResponse<List<EmployeeResponse>> getAll();

    ApiResponse<EmployeeResponse> getById(Long id);
}
