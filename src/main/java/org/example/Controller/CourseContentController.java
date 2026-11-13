package org.example.Controller;

import org.example.Model.CourseContent;
import org.example.Service.CourseContentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course-contents")
public class CourseContentController {

    private final CourseContentService courseContentService;

    public CourseContentController(CourseContentService courseContentService) {
        this.courseContentService = courseContentService;
    }

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public CourseContent addContent(
            @PathVariable Long courseId,
            @RequestBody CourseContent content,
            @AuthenticationPrincipal UserDetails userDetails) {
        return courseContentService.addContent(courseId, content, userDetails);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<CourseContent> getAllContent() {
        return courseContentService.getAllContent();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CourseContent getContentById(@PathVariable Long id) {
        return courseContentService.getContentById(id);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public List<CourseContent> getContentByCourse(@PathVariable Long courseId) {
        return courseContentService.getContentByCourse(courseId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public CourseContent updateContent(
            @PathVariable Long id,
            @RequestBody CourseContent updatedContent,
            @AuthenticationPrincipal UserDetails userDetails) {
        return courseContentService.updateContent(id, updatedContent, userDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public String deleteContent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        courseContentService.deleteContent(id, userDetails);
        return "Content deleted successfully";
    }
}
