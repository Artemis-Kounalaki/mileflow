package gr.mileflow.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserInsertDTO(

        @NotNull
        @Size(min = 3, max = 20)
        String username,


        @NotBlank
        @Email
        String email
) {
}
