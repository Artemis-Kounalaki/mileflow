package gr.mileflow.app.repository;

import gr.mileflow.app.model.Coach;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {

    Optional<Coach> findByUser_KeycloakId(String keycloakId);
    Optional<Coach> findByUser_KeycloakIdAndDeletedFalse(String keycloakId);
    Page<Coach> findAllByDeletedFalse(Pageable pageable);
    Optional<Coach> findByIdAndDeletedFalse(Long id);

    boolean existsByIdAndUser_KeycloakId(Long coachId, String keycloakId);


}
