package org.example.Repository;

import org.example.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmailOrderBySentAtDesc(String recipientEmail);
}