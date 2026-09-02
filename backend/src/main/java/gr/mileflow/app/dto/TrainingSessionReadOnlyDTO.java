package gr.mileflow.app.dto;

import gr.mileflow.app.model.TrainingSession;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TrainingSessionReadOnlyDTO(
        Long id,
        Long athleteId,
        Long sportId,
        String sportName,
        Integer sets,
        LocalTime targetTime,
        LocalTime actualTime,
        LocalDateTime sessionDate,
        String description,
        TrainingSession.Status status
) {
}
