package org.example.Service;

import org.example.Enumeration.ContentType;
import org.example.Enumeration.Role;
import org.example.Enumeration.VerificationStatus;
import org.example.Model.*;
import org.example.Repository.CourseContentRepo;
import org.example.Repository.CourseRepo;
import org.example.Repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CourseContentService {

    private final CourseContentRepo contentRepo;
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;

    public CourseContentService(CourseContentRepo contentRepo, CourseRepo courseRepo, UserRepo userRepo) {
        this.contentRepo = contentRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    // Add content to a course (Instructor must be verified and must own the course)
    public CourseContent addContent(Long courseId, CourseContent rawContent, UserDetails userDetails) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        User instructor = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Instructor not found"));

        if (instructor.getRole() != Role.INSTRUCTOR || instructor.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not an instructor or not approved as instructor");
        }

        if (course.getInstructor().getId() != instructor.getId()) {
            throw new AccessDeniedException("You can add content only to your own courses");
        }

        // 1. Let the safety net determine the content type if it was left null by the client
        if (rawContent.getContenttype() == null && rawContent.getContenturl() != null) {
            rawContent.prePersistContentType();
        }

        // 2. CONVERT the raw generic object into the correct Polymorphic Subclass
        CourseContent concreteContent;
        if (rawContent.getContenttype() == ContentType.VIDEO) {
            concreteContent = new VideoContent();
        } else if (rawContent.getContenttype() == ContentType.PDF) {
            concreteContent = new PdfContent();
        } else if (rawContent.getContenttype() == ContentType.QUIZZ) {
            concreteContent = new QuizContent();
        } else {
            // Fallback if no type could be inferred
            concreteContent = new CourseContent();
        }

        // 3. Copy over the details to our concrete subclass instance
        concreteContent.setCourse(course);
        concreteContent.setContenturl(rawContent.getContenturl());
        concreteContent.setContenttype(rawContent.getContenttype());
        concreteContent.setSequenceOrder(rawContent.getSequenceOrder());

        // 4. Save the actual specialized child class instance!
        return contentRepo.save(concreteContent);
    }

    // Get all content
    public List<CourseContent> getAllContent() {
        return contentRepo.findAll();
    }

    // Get content by ID
    public CourseContent getContentById(Long id) {
        return contentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found"));
    }

    // Get all content belonging to a course in sequence order
    public List<CourseContent> getContentByCourse(Long courseId) {
        if (!courseRepo.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        return contentRepo.findByCourse_IdOrderBySequenceOrderAsc(courseId);
    }

    // Update content (Owner instructor or Admin only)
    public CourseContent updateContent(Long id, CourseContent updatedContent, UserDetails userDetails) {
        CourseContent existing = getContentById(updatedContent.getId());

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = existing.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You can update only content belonging to your own courses");
        }

        if (updatedContent.getContenttype() != null) {
            existing.setContenttype(updatedContent.getContenttype());
        }
        if (updatedContent.getContenturl() != null) {
            existing.setContenturl(updatedContent.getContenturl());
        }
        if (updatedContent.getSequenceOrder() != null) {
            existing.setSequenceOrder(updatedContent.getSequenceOrder());
        }

        return contentRepo.save(existing);
    }

    // Delete content (Owner instructor or Admin only)
    public void deleteContent(Long id, UserDetails userDetails) {
        CourseContent existing = getContentById(id);

        User loggedInUser = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        boolean isAdmin = loggedInUser.getRole() == Role.ADMIN;
        boolean isOwner = existing.getCourse().getInstructor().getId() == loggedInUser.getId();

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You can delete only content belonging to your own courses");
        }

        contentRepo.deleteById(id);
    }
}
