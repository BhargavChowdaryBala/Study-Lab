package org.example.Controller;

import org.example.Model.Enrollment;
import org.example.Service.EnrollmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public Enrollment enrollStudent(
            @RequestParam Long courseId,
            @RequestParam(required = false) Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.enrollStudent(courseId, userDetails);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Enrollment> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Enrollment getEnrollmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.getEnrollmentById(id, userDetails);
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Enrollment> getMyEnrollments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.getMyEnrollments(userDetails);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    public List<Enrollment> getByStudent(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.getByStudent(studentId, userDetails);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public List<Enrollment> getByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.getByCourse(courseId, userDetails);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("isAuthenticated()")
    public Enrollment completeEnrollment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.completeEnrollment(id, userDetails);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public Enrollment cancelEnrollment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return enrollmentService.cancelEnrollment(id, userDetails);
    }
}
