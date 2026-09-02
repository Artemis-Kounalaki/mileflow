package gr.mileflow.app.dto;

import java.time.LocalDate;

public record CoachReadOnlyDTO(
        Long id,
        String firstname,
        String lastname,
        LocalDate birthday
) {
}
