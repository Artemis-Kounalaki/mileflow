package gr.mileflow.app.repository;

import gr.mileflow.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByKeycloakId(String keycloakId);

    Optional<User> findByKeycloakIdAndDeletedFalse(String keycloakId);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);


}
