package org.example.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.Enumeration.EnrollmentStatus;

import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Enrollment {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "student_id_rno")
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id",nullable = false)
    private Course course;

    @Column(nullable = false)
    private LocalTime enrolledAt;

//    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status=EnrollmentStatus.ONGOING;

    @PrePersist
    public void prePersist(){
        if(enrolledAt==null){
            enrolledAt= LocalTime.now();
        }
    }
}

