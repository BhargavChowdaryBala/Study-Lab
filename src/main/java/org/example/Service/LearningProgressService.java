package org.example.Service;

import org.example.Enumeration.EnrollmentStatus;
import org.example.Enumeration.Role;
import org.example.Model.CourseContent;
import org.example.Model.Enrollment;
import org.example.Model.LearningProgress;
import org.example.Model.User;
import org.example.Repository.CourseContentRepo;
import org.example.Repository.EnrollmentRepo;
import org.example.Repository.LearningProgressRepo;
import org.example.Repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LearningProgressService {

    private final LearningProgressRepo learningProgressRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final CourseContentRepo courseContentRepo;
    private final UserRepo userRepo;


    public LearningProgressService(
            LearningProgressRepo learningProgressRepo,
            EnrollmentRepo enrollmentRepo,
            CourseContentRepo courseContentRepo,
            UserRepo userRepo) {
        this.learningProgressRepo = learningProgressRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.courseContentRepo = courseContentRepo;
        this.userRepo = userRepo;
    }

    // Mark a specific content as completed for an enrollment
    public LearningProgress markContentComplete(
            Long enrollmentId, Long contentId, UserDetails userDetails) {

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        Enrollment enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You can update only your own learning progress");
        }

        if (enrollment.getStatus() == EnrollmentStatus.CANCEL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cannot update progress for a cancelled enrollment");
        }

        CourseContent content = courseContentRepo.findById(contentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course content not found"));

        if (content.getCourse() == null
                || content.getCourse().getId() != enrollment.getCourse().getId()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Content does not belong to the enrolled course");
        }

        LearningProgress progress = learningProgressRepo
                .findByEnrollment_IdAndContent_Id(enrollmentId, contentId)
                .orElseGet(() -> {
                    LearningProgress lp = new LearningProgress();
                    lp.setEnrollment(enrollment);
                    lp.setContent(content);
                    return lp;
                });

        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        LearningProgress saved = learningProgressRepo.save(progress);

        // Check if all contents are completed, and auto-complete enrollment
        long totalContents = courseContentRepo.countByCourse_Id(enrollment.getCourse().getId());
        long completedContents = learningProgressRepo.countByEnrollment_IdAndCompletedTrue(enrollmentId);

        if (totalContents > 0 && completedContents >= totalContents) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepo.save(enrollment);
        }

        return saved;
    }

    // Mark a specific content as incomplete (undo completion)
    public LearningProgress markContentIncomplete(
            Long enrollmentId, Long contentId, UserDetails userDetails) {

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        Enrollment enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You can update only your own learning progress");
        }

        if (enrollment.getStatus() == EnrollmentStatus.CANCEL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cannot update progress for a cancelled enrollment");
        }

        CourseContent content = courseContentRepo.findById(contentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course content not found"));

        if (content.getCourse() == null
                || content.getCourse().getId() != enrollment.getCourse().getId()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Content does not belong to the enrolled course");
        }

        LearningProgress progress = learningProgressRepo
                .findByEnrollment_IdAndContent_Id(enrollmentId, contentId)
                .orElseGet(() -> {
                    LearningProgress lp = new LearningProgress();
                    lp.setEnrollment(enrollment);
                    lp.setContent(content);
                    return lp;
                });

        progress.setCompleted(false);
        progress.setCompletedAt(null);
        LearningProgress saved = learningProgressRepo.save(progress);

        // If enrollment was COMPLETED and student unmarked a lesson, revert back to ONGOING
        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            enrollment.setStatus(EnrollmentStatus.ONGOING);
            enrollmentRepo.save(enrollment);
        }

        return saved;
    }

    // Get all learning progress records for an enrollment
    public List<LearningProgress> getProgressByEnrollment(
            Long enrollmentId, UserDetails userDetails) {

        Enrollment enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();
        boolean isCourseInstructor = enrollment.getCourse() != null
                && enrollment.getCourse().getInstructor() != null
                && enrollment.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner && !isCourseInstructor) {
            throw new AccessDeniedException("You are not authorized to view this learning progress");
        }

        return learningProgressRepo.findByEnrollment_Id(enrollmentId);
    }

    // Get progress percentage and summary for an enrollment
    public Map<String, Object> getProgressSummary(
            Long enrollmentId, UserDetails userDetails) {

        Enrollment enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();
        boolean isCourseInstructor = enrollment.getCourse() != null
                && enrollment.getCourse().getInstructor() != null
                && enrollment.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner && !isCourseInstructor) {
            throw new AccessDeniedException("You are not authorized to view this learning progress");
        }

        long totalContents = courseContentRepo.countByCourse_Id(enrollment.getCourse().getId());
        long completedContents = learningProgressRepo.countByEnrollment_IdAndCompletedTrue(enrollmentId);
        double percentage = totalContents == 0 ? 0.0 : ((double) completedContents / totalContents) * 100.0;
        double roundedPercentage = Math.round(percentage * 100.0) / 100.0;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("enrollmentId", enrollmentId);
        summary.put("studentId", enrollment.getStudent() != null ? enrollment.getStudent().getId() : null);
        summary.put("studentName", enrollment.getStudent() != null ? enrollment.getStudent().getName() : null);
        summary.put("courseId", enrollment.getCourse() != null ? enrollment.getCourse().getId() : null);
        summary.put("courseTitle", enrollment.getCourse() != null ? enrollment.getCourse().getTitle() : null);
        summary.put("totalContents", totalContents);
        summary.put("completedContents", completedContents);
        summary.put("progressPercentage", roundedPercentage);
        summary.put("status", enrollment.getStatus());

        return summary;
    }

    // Get current logged-in student's progress summary by courseId directly
    public Map<String, Object> getMyProgressForCourse(Long courseId, UserDetails userDetails) {
        User student = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        List<Enrollment> enrollments = enrollmentRepo.findByStudent_Id(student.getId());

        Enrollment enrollment = enrollments.stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getId() == courseId)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "You are not enrolled in this course"));

        return getProgressSummary(enrollment.getId(), userDetails);
    }
}