package com.example.HRMS.controller;

import com.example.HRMS.service.ai.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @GetMapping("/analyze")
    public String analyze(@RequestParam String input) {
        return aiService.analyzeEmployeeData(input);
    }
}