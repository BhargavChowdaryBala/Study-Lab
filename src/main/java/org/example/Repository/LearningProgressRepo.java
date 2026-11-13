package org.example.Repository;
import org.example.Model.LearningProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningProgressRepo extends JpaRepository<LearningProgress, Long> {

    Optional<LearningProgress> findByEnrollment_IdAndContent_Id(Long enrollmentId, Long contentId);

    List<LearningProgress> findByEnrollment_Id(Long enrollmentId);

    long countByEnrollment_IdAndCompletedTrue(Long enrollmentId);

    boolean existsByEnrollment_IdAndContent_Id(Long enrollmentId, Long contentId);
}