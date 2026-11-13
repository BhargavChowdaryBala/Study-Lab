package org.example.Controller;

import org.example.Model.Notification;
import org.example.Service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Manual test endpoint: Send custom email (Admin only)
    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendCustomEmail(
            @RequestParam String toEmail,
            @RequestParam String subject,
            @RequestParam String body) {
        notificationService.sendEmail(toEmail, subject, body, "CUSTOM");
        return ResponseEntity.ok("Email sent successfully to: " + toEmail);
    }

    // Get notifications sent to logged-in user
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public List<Notification> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return notificationService.getMyNotifications(userDetails.getUsername());
    }

    // Get all sent notification history (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Notification> getAllNotifications() {

        return notificationService.getAllNotifications();
    }
}
