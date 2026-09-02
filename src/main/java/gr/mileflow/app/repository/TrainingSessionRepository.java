package gr.mileflow.app.repository;

import gr.mileflow.app.model.TrainingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    Page<TrainingSession> findAllByAthlete_IdAndAthlete_Coach_IdAndDeletedFalse(Long athleteId, Long coachId, Pageable pageable);

    Optional<TrainingSession> findByIdAndAthlete_Coach_IdAndDeletedFalse(Long sessionId, Long coachId);

    List<TrainingSession> findAllByAthlete_IdAndDeletedFalseOrderBySessionDateDesc(Long athleteId);

    List<TrainingSession> findAllByAthlete_IdAndSport_IdAndDeletedFalseOrderBySessionDateDesc(Long athleteId, Long sportId);

    List<TrainingSession> findAllByCoach_IdAndSessionDateGreaterThanEqualAndSessionDateLessThanAndDeletedFalseOrderBySessionDateAsc(Long coachId, LocalDateTime startOfDay, LocalDateTime startOfNextDay);

    Page<TrainingSession> findAllByAthlete_IdAndDeletedFalse(Long athleteId, Pageable pageable);

}
