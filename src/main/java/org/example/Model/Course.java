package org.example.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable=false , unique = true)
    private String title;
    @Column(nullable = false,length = 2000)
    private String Description;
    private String Category;
    @ManyToOne
    @JoinColumn(name = "instructor_id",nullable=false)
    private User instructor;
    //by adding this private User instrucutor we can access the User object directly from course
    //if this line is not there than we need to take instructor id from here we need to go User table and we ned to take details from therre
    //but by using this line we can course.getinstrucutor().getEmail();
    // we are saying to hibernate that Map this Java object reference to that database foreign key column.
}
