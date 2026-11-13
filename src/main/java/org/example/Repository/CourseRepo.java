package org.example.Repository;

import org.example.Model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepo extends JpaRepository<Course,Long> {
    List<Course> findByTitle(String title);

    List<Course> findByInstructor_Id(long instructorId);
}