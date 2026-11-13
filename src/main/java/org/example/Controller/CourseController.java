
package org.example.Controller;

import org.example.Model.Course;
import org.example.Service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> createCourse(
            @RequestBody Course course,
            @AuthenticationPrincipal UserDetails userDetails) {

        return courseService.createCourse(course, userDetails);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Course getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestBody Course course,
            @AuthenticationPrincipal UserDetails userDetails) {

        return courseService.updateCourse(id, course, userDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return courseService.deleteCourse(id, userDetails);
    }
    @GetMapping("/instructor/{id}")
    public ResponseEntity<?> getAllcoursesByInstructor(@PathVariable Long id)
    {
        return courseService.getAllCoursesByInstructor(id);
    }
}
