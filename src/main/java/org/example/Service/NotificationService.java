package org.example.Service;

import org.example.Model.Notification;
import org.example.Repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final NotificationRepo notificationRepo;

    @Value("${spring.mail.username:noreply@coursemanagementsystem.com}")
    private String fromEmail;

    public NotificationService(JavaMailSender mailSender, NotificationRepo notificationRepo) {
        this.mailSender = mailSender;
        this.notificationRepo = notificationRepo;
    }

    // Core method to send an email and save notification record in database
    public void sendEmail(String toEmail, String subject, String body, String type) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            System.err.println("Cannot send email: Recipient email is empty");
            return;
        }

        try
        {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(body);

            mailSender.send(mailMessage);
            System.out.println("Email successfully sent to: " + toEmail + " | Subject: " + subject);

            // Save notification history in database
            Notification notification = new Notification();
            notification.setRecipientEmail(toEmail);
            notification.setSubject(subject);
            notification.setMessage(body);
            notification.setType(type != null ? type : "GENERAL");
            notification.setSentAt(LocalDateTime.now());
            notificationRepo.save(notification);

        } catch (Exception e) {
            System.err.println("Error sending email to " + toEmail + ": " + e.getMessage());
        }
    }

    // 1. Send Welcome Email when a Student registers
    public void sendRegistrationEmail(String studentEmail, String studentName) {
        String subject = "Welcome to Online Course Management System!";
        String body = "Hello " + (studentName != null ? studentName : "Student") + ",\n\n"
                + "Welcome to the Online Course Management System!\n"
                + "Your student account has been registered successfully.\n\n"
                + "You can now log in, explore our catalog of courses, and begin learning.\n\n"
                + "Best regards,\n"
                + "Online Course Management Team";

        sendEmail(studentEmail, subject, body, "REGISTRATION");
    }

    // 2. Send Confirmation Email when a Student enrolls in a Course
    public void sendEnrollmentEmail(String studentEmail, String studentName, String courseTitle, String instructorName) {
        String subject = "Course Enrollment Confirmation: " + courseTitle;
        String body = "Hello " + (studentName != null ? studentName : "Student") + ",\n\n"
                + "Congratulations! You have successfully enrolled in the course:\n"
                + "\"" + courseTitle + "\"\n\n"
                + "Course Instructor: " + (instructorName != null ? instructorName : "Not Assigned") + "\n\n"
                + "You can now access all course lectures, videos, PDFs, and quizzes in your dashboard.\n\n"
                + "Happy learning!\n"
                + "Online Course Management Team";

        sendEmail(studentEmail, subject, body, "ENROLLMENT");
    }

    // 3. Send Approval Email when Admin approves an Instructor
    public void sendInstructorApprovalEmail(String instructorEmail, String instructorName) {
        String subject = "Instructor Account Approved!";
        String body = "Hello " + (instructorName != null ? instructorName : "Instructor") + ",\n\n"
                + "Great news! Your instructor application has been reviewed and APPROVED by the Administrator.\n\n"
                + "You now have full instructor privileges to:\n"
                + "1. Create new courses\n"
                + "2. Add and manage course contents (Videos, PDFs, Quizzes)\n"
                + "3. Monitor student enrollments\n\n"
                + "Welcome aboard!\n"
                + "Online Course Management Team";

        sendEmail(instructorEmail, subject, body, "INSTRUCTOR_APPROVAL");
    }

    // Get all notifications (Admin)
    public List<Notification> getAllNotifications() {
        return notificationRepo.findAll();
    }

    // Get notifications sent to a specific user email
    public List<Notification> getMyNotifications(String email) {
        return notificationRepo.findByRecipientEmailOrderBySentAtDesc(email);
    }
}
