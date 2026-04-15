package com.example.HRMS.repository;

import com.example.HRMS.entity.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    List<NotificationLog> findByTypeAndStatus(String type, String status);
}