package gr.mileflow.app.dto;

import gr.mileflow.app.model.Athlete;
import java.time.LocalDate;

public record AthleteReadOnlyDTO(
        Long id,
        String firstname,
        String lastname,
        LocalDate birthday,
        Athlete.Gender gender,
        String username,
        String email

) {
}
