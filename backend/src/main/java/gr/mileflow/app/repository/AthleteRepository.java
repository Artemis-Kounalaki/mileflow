package gr.mileflow.app.repository;

import gr.mileflow.app.model.Athlete;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.Optional;


@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Long> {

    Optional<Athlete> findByUser_KeycloakId(String keycloakId);
    Optional<Athlete> findByUser_KeycloakIdAndDeletedFalse(String keycloakId);
    Optional<Athlete> findByIdAndCoach_IdAndDeletedFalse(Long athleteId, Long coachId);

    Page<Athlete> findAllByDeletedFalse(Pageable pageable);
    Page<Athlete> findAllByCoach_IdAndDeletedFalse(Long coachId, Pageable pageable);
    boolean existsByIdAndUser_KeycloakId(Long athleteId, String keycloakId);


}
