package gr.mileflow.app.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CoachUpdateDTO(
        @NotNull
        @Size(min = 2)
        String firstname,

        @NotNull
        @Size(min = 2)
        String lastname,

        @NotNull
        LocalDate birthday,

        @Valid
        @NotNull
        UserUpdateDTO user
) {
}