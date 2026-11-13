package org.example.Model;

import org.example.Enumeration.ContentType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("QUIZZ")
public class QuizContent extends CourseContent {

    public QuizContent() {
        super();
        setContenttype(ContentType.QUIZZ);
    }
}
