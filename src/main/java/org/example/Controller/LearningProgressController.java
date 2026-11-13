package org.example.Controller;

import org.example.Model.LearningProgress;
import org.example.Service.LearningProgressService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/learning-progress")
public class LearningProgressController {

    private final LearningProgressService learningProgressService;

    public LearningProgressController(LearningProgressService learningProgressService) {
        this.learningProgressService = learningProgressService;
    }

    // Mark a lesson/content as completed
    @PostMapping("/enrollment/{enrollmentId}/content/{contentId}/complete")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public LearningProgress markContentComplete(
            @PathVariable Long enrollmentId,
            @PathVariable Long contentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return learningProgressService.markContentComplete(enrollmentId, contentId, userDetails);
    }

    // Mark a lesson/content as incomplete (undo completion)
    @PostMapping("/enrollment/{enrollmentId}/content/{contentId}/incomplete")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public LearningProgress markContentIncomplete(
            @PathVariable Long enrollmentId,
            @PathVariable Long contentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return learningProgressService.markContentIncomplete(enrollmentId, contentId, userDetails);
    }

    // Get all progress records for an enrollment
    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("isAuthenticated()")
    public List<LearningProgress> getProgressByEnrollment(
            @PathVariable Long enrollmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return learningProgressService.getProgressByEnrollment(enrollmentId, userDetails);
    }

    // Get progress summary and completion percentage for an enrollment
    @GetMapping("/enrollment/{enrollmentId}/summary")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> getProgressSummary(
            @PathVariable Long enrollmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return learningProgressService.getProgressSummary(enrollmentId, userDetails);
    }

    // Convenience endpoint: Logged-in student gets progress percentage for a course
    @GetMapping("/course/{courseId}/my-summary")
    @PreAuthorize("hasRole('STUDENT')")
    public Map<String, Object> getMyProgressForCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return learningProgressService.getMyProgressForCourse(courseId, userDetails);
    }
}
