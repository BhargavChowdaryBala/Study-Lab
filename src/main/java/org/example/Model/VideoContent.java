package org.example.Model;

import org.example.Enumeration.ContentType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VIDEO")
public class VideoContent extends CourseContent {

    public VideoContent() {
        super();
        setContenttype(ContentType.VIDEO);
    }
}
