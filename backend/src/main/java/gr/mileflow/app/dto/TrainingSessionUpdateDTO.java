package gr.mileflow.app.dto;

import gr.mileflow.app.model.TrainingSession;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TrainingSessionUpdateDTO(
        @NotNull
        Long sportId,

        @NotNull
        @Positive
        Integer sets,

        @NotNull
        LocalTime targetTime,

        LocalTime actualTime,

        @NotNull
        LocalDateTime sessionDate,

        String description,

        @NotNull
        TrainingSession.Status status
) {
}
