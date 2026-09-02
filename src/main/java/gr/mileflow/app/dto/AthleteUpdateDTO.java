package gr.mileflow.app.dto;

import gr.mileflow.app.model.Athlete;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AthleteUpdateDTO(

        @NotNull
        @Size(min = 2)
        String firstname,

        @NotNull
        @Size(min = 2)
        String lastname,

        @NotNull
        LocalDate birthday,

        @NotNull
        Athlete.Gender gender,

        @Valid
        @NotNull
        UserUpdateDTO user
) {
}
