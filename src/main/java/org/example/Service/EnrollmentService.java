package org.example.Service;

import org.example.Enumeration.EnrollmentStatus;
import org.example.Enumeration.Role;
import org.example.Model.Course;
import org.example.Model.Enrollment;
import org.example.Model.User;
import org.example.Repository.CourseRepo;
import org.example.Repository.EnrollmentRepo;
import org.example.Repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepo enrollmentRepo;
    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final NotificationService notificationService;

    public EnrollmentService(
            EnrollmentRepo enrollmentRepo,
            UserRepo userRepo,
            CourseRepo courseRepo,
            NotificationService notificationService) {
        this.enrollmentRepo = enrollmentRepo;
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
        this.notificationService = notificationService;
    }

    // Enroll a student in a course
    public Enrollment enrollStudent(Long courseId, UserDetails userDetails) {

        User student = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only students can enroll in courses");
        }

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));

        if (enrollmentRepo.existsByStudent_IdAndCourse_Id(
                student.getId(), courseId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.ONGOING);

        Enrollment savedEnrollment = enrollmentRepo.save(enrollment);

        // Send enrollment confirmation email to the student
        notificationService.sendEnrollmentEmail(student.getEmail(), student.getName(), course.getTitle(),course.getInstructor().getName());
//        notificationService.sendEnrollmentEmail(course.getInstructor().getEmail(), student.getName(), course.getTitle(), student.getEmail());

        return savedEnrollment;
    }

    // Get all enrollments (Admin only)
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepo.findAll();
    }

    // Get enrollment by ID (Enrolled student, course instructor, or Admin)
    public Enrollment getEnrollmentById(Long id, UserDetails userDetails) {
        Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isStudentOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();
        boolean isCourseInstructor = enrollment.getCourse() != null
                && enrollment.getCourse().getInstructor() != null
                && enrollment.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isStudentOwner && !isCourseInstructor) {
            throw new AccessDeniedException("You are not authorized to view this enrollment");
        }

        return enrollment;
    }

    // Get enrollments by student ID (Enrolled student themselves or Admin)
    public List<Enrollment> getByStudent(Long studentId, UserDetails userDetails) {
        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = loggedInUser.getId() == studentId;

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You can view only your own enrollments");
        }

        if (!userRepo.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }

        return enrollmentRepo.findByStudent_Id(studentId);
    }

    // Get my enrollments (Logged-in student)
    public List<Enrollment> getMyEnrollments(UserDetails userDetails) {
        User student = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        return enrollmentRepo.findByStudent_Id(student.getId());
    }

    // Get enrollments by course ID (Course instructor or Admin)
    public List<Enrollment> getByCourse(Long courseId, UserDetails userDetails) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isCourseInstructor = course.getInstructor() != null
                && course.getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isCourseInstructor) {
            throw new AccessDeniedException("You can view enrollments only for your own courses");
        }

        return enrollmentRepo.findByCourse_Id(courseId);
    }

    // Mark an enrollment as completed (Enrolled student, course instructor, or Admin)
    public Enrollment completeEnrollment(Long id, UserDetails userDetails) {
        Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isStudentOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();
        boolean isCourseInstructor = enrollment.getCourse() != null
                && enrollment.getCourse().getInstructor() != null
                && enrollment.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isStudentOwner && !isCourseInstructor) {
            throw new AccessDeniedException("You are not authorized to complete this enrollment");
        }

        enrollment.setStatus(EnrollmentStatus.COMPLETED);
        return enrollmentRepo.save(enrollment);
    }

    // Cancel an enrollment (Enrolled student or Admin)
    public Enrollment cancelEnrollment(Long id, UserDetails userDetails) {
        Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Enrollment not found"));

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isStudentOwner = enrollment.getStudent() != null
                && enrollment.getStudent().getId() == loggedInUser.getId();

        if (!isAdmin && !isStudentOwner) {
            throw new AccessDeniedException("You can cancel only your own enrollment");
        }

        enrollment.setStatus(EnrollmentStatus.CANCEL);
        return enrollmentRepo.save(enrollment);
    }
}
