package org.example.Repository;

import org.example.Model.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseContentRepo extends JpaRepository<CourseContent,Long> {
    List<CourseContent> findByCourse_Id(Long courseId);

    List<CourseContent> findByCourse_IdOrderBySequenceOrderAsc(
            Long courseId);

    long countByCourse_Id(Long courseId);
}


