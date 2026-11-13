package org.example.Model;

import org.example.Enumeration.ContentType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PDF")
public class PdfContent extends CourseContent {

    public PdfContent() {
        super();
        setContenttype(ContentType.PDF);
    }
}
