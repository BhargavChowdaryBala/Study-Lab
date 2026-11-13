package org.example.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.Enumeration.ContentType;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// Tells Hibernate which subclass a row belongs to (VIDEO, PDF, or QUIZZ)
//discriminator refers to which row of that single table belongs tp this class
// Tells Hibernate which subclass a row belongs to (VIDEO, PDF, or QUIZZ) where spring hides it
//It adds an extra column called content_class (the discriminator column) so Hibernate knows which Java class to build when reading from the database.
//why cant we use enum -> because if we use discriminator then in future we can set like for video we can keep length of hours where enum doesnot support
@DiscriminatorColumn(name = "content_class", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
public class CourseContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    private ContentType contenttype;

    private String contenturl;

    private Integer sequenceOrder;
//
//    public void setContentTypeBasedOnEntityClass(Class<?> entityClass) {
//        if (entityClass == null) return;
//        // 1. Gets "VIDEOCONTENT" or "PDFCONTENT" or "QUIZCONTENT"
//        String name = entityClass.getSimpleName().toUpperCase();
//        if (name.contains("VIDEO")) {
//            this.contenttype = ContentType.VIDEO;
//        } else if (name.contains("PDF")) {
//            this.contenttype = ContentType.PDF;
//        } else if (name.contains("QUIZ")) {
//            this.contenttype = ContentType.QUIZZ;
//        }
//    }
//
//    public void setContentTypeBasedOnEntity(Object entity) {
//        if (entity != null) {
//            setContentTypeBasedOnEntityClass(entity.getClass());
//        }
//    }

    @PrePersist
    @PreUpdate
    public void prePersistContentType() {
        if (this.contenttype != null) {
            return;
        }
        if (this.contenturl != null) {
            String url = this.contenturl.toLowerCase();
            if (url.endsWith(".mp4") || url.endsWith(".mkv") || url.contains("video") || url.contains("youtube") || url.contains("vimeo")) {
                this.contenttype = ContentType.VIDEO;
            } else if (url.endsWith(".pdf")) {
                this.contenttype = ContentType.PDF;
            } else if (url.contains("quiz")) {
                this.contenttype = ContentType.QUIZZ;
            }
        }
    }

}
