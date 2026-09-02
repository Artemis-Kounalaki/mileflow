package gr.mileflow.app.repository;

import gr.mileflow.app.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SportRepository extends JpaRepository<Sport, Long> {
        List<Sport> findAllByDeletedFalse();
        Optional<Sport> findByIdAndDeletedFalse(Long sportId);
    }

