
package org.example.Service;

import org.example.Enumeration.Role;
import org.example.Enumeration.VerificationStatus;
import org.example.Model.Course;
import org.example.Model.User;
import org.example.Repository.CourseRepo;
import org.example.Repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepo courseRepo;
    private final UserRepo userRepo;
    public CourseService(CourseRepo courseRepo, UserRepo userRepo) {
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    public ResponseEntity<?> createCourse(
            Course course, UserDetails userDetails) {

        User instructor = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Instructor not found"));

        if (instructor.getRole() != Role.INSTRUCTOR
                || instructor.getVerificationStatus()
                != VerificationStatus.APPROVED) {
            throw new ResponseStatusException(
                     HttpStatus.FORBIDDEN,
                    "User is not an instructor or not approved as instructor");
        }

        if (course.getTitle() == null || course.getTitle().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Course title is required");
        }

        List<Course> courses = courseRepo.findByTitle(course.getTitle());

        boolean titleExists = false;

        for (Course c : courses) {
            if (c.getTitle() != null
                    && c.getTitle().equalsIgnoreCase(course.getTitle())) {
                titleExists = true;
                break;
            }
        }
        if (titleExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Course already created by another instructor");
        }
        course.setInstructor(instructor);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseRepo.save(course));
    }

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course not found"));
    }

    public ResponseEntity<Course> updateCourse(
            Long id, Course updatedCourse, UserDetails userDetails) {

        Course existing = getCourseById(id);

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;

        boolean isOwner =
                existing.getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException(
                    "You can update only your own courses");
        }

        if (updatedCourse.getTitle() != null
                && !updatedCourse.getTitle().isBlank()
                && !updatedCourse.getTitle()
                .equalsIgnoreCase(existing.getTitle())) {

            List<Course> courses =
                    courseRepo.findByTitle(updatedCourse.getTitle());

            boolean duplicate = false;

            for (Course c : courses) {
                if (c.getId() != id
                        && c.getTitle() != null
                        && c.getTitle().equalsIgnoreCase(
                        updatedCourse.getTitle())) {
                    duplicate = true;
                    break;
                }
            }

            if (duplicate) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Course title already exists , choose another course");
            }

            existing.setTitle(updatedCourse.getTitle());
        }

        if (updatedCourse.getDescription() != null) {
            existing.setDescription(updatedCourse.getDescription());
        }
        if (updatedCourse.getCategory() != null) {
            existing.setCategory(updatedCourse.getCategory());
        }
        return ResponseEntity.ok(courseRepo.save(existing));
    }

    public ResponseEntity<?> deleteCourse(
            Long id, UserDetails userDetails) {

        Course course = getCourseById(id);

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;

        boolean isOwner =
                course.getInstructor().getId() == loggedInUser.getId();
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException(
                    "You can delete only your own courses");
        }
        courseRepo.deleteById(id);
        return ResponseEntity.ok("Course deleted successfully");
    }
    public ResponseEntity<?> getAllCoursesByInstructor(Long id)
    {
        List<Course> courses=courseRepo.findByInstructor_Id(id);
        return ResponseEntity.status(HttpStatus.OK).body(courses);
    }
}
