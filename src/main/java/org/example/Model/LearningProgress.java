package org.example.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "learning_progress",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"enrollment_id", "content_id"}
        )
)
@Getter
@Setter
public class LearningProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private CourseContent content;

//    @Enumerated(EnumType.STRING)
    private boolean completed = false;

    private LocalDateTime completedAt;

}
